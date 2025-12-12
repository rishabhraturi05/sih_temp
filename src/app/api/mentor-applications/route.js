import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import MentorApplication from '@/models/MentorApplication';
import Mentor from '@/models/Mentor';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST: Add a mentor to user's applications
export async function POST(request) {
  try {
    await connectToDatabase();

    // Verify authentication
    const decoded = verifyToken(request);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json(
        { message: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    // Verify mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { message: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Find or create mentor application for this user
    let application = await MentorApplication.findOne({ userId: decoded.userId });

    if (!application) {
      // Create new application document
      application = new MentorApplication({
        userId: decoded.userId,
        mentorIds: [mentorId],
        mentorStatuses: [{
          mentorId: mentorId,
          status: 'pending'
        }]
      });
    } else {
      // Add mentor if not already in the list
      if (!application.mentorIds.some(id => id.toString() === mentorId.toString())) {
        application.mentorIds.push(mentorId);
        // Also add to mentorStatuses with pending status
        if (!application.mentorStatuses.some(ms => ms.mentorId.toString() === mentorId.toString())) {
          application.mentorStatuses.push({
            mentorId: mentorId,
            status: 'pending'
          });
        }
      } else {
        return NextResponse.json(
          { message: 'You have already applied to this mentor' },
          { status: 400 }
        );
      }
    }

    await application.save();

    return NextResponse.json(
      {
        message: 'Mentor application added successfully',
        application
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding mentor application:', error);
    return NextResponse.json(
      { message: 'Failed to add mentor application', error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all applied mentors for the current user
export async function GET(request) {
  try {
    await connectToDatabase();

    // Verify authentication
    const decoded = verifyToken(request);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Find mentor application for this user
    const application = await MentorApplication.findOne({ userId: decoded.userId })
      .populate('mentorIds', 'Name Title Bio Photo email');

    if (!application || application.mentorIds.length === 0) {
      return NextResponse.json(
        { mentors: [] },
        { status: 200 }
      );
    }

    // Map mentors to match the expected format with status
    const mentors = application.mentorIds.map((mentor) => {
      // Find the status for this mentor
      const mentorStatus = application.mentorStatuses?.find(
        ms => ms.mentorId.toString() === mentor._id.toString()
      ) || { status: 'pending' };

      return {
        id: mentor._id,
        applicationId: application._id,
        name: mentor.Name || '',
        title: mentor.Title || '',
        bio: mentor.Bio || '',
        avatar: mentor.Photo || 'https://i.pravatar.cc/600?img=1',
        email: mentor.email || '',
        status: mentorStatus.status || 'pending',
        respondedAt: mentorStatus.respondedAt || null,
        meetingDate: mentorStatus.meetingDate || null,
        meetingTime: mentorStatus.meetingTime || null,
        meetingScheduledAt: mentorStatus.meetingScheduledAt || null,
      };
    });

    return NextResponse.json(
      { mentors },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentor applications:', error);
    return NextResponse.json(
      { message: 'Failed to fetch mentor applications', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Retract a mentor application (only if not scheduled)
export async function DELETE(request) {
  try {
    await connectToDatabase();

    // Verify authentication
    const decoded = verifyToken(request);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json(
        { message: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    // Find the user's application
    const application = await MentorApplication.findOne({ userId: decoded.userId });

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    // Find mentor status entry
    const mentorStatus = application.mentorStatuses?.find(
      (ms) => ms.mentorId.toString() === mentorId.toString()
    );

    // If scheduled, block retract
    if (mentorStatus && (mentorStatus.meetingDate || mentorStatus.meetingTime)) {
      return NextResponse.json(
        { message: 'Cannot retract: meeting already scheduled.' },
        { status: 400 }
      );
    }

    // Remove mentorId and status
    application.mentorIds = application.mentorIds.filter(
      (id) => id.toString() !== mentorId.toString()
    );
    application.mentorStatuses = (application.mentorStatuses || []).filter(
      (ms) => ms.mentorId.toString() !== mentorId.toString()
    );

    await application.save();

    return NextResponse.json(
      { message: 'Application retracted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retracting mentor application:', error);
    return NextResponse.json(
      { message: 'Failed to retract mentor application', error: error.message },
      { status: 500 }
    );
  }
}

