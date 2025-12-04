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
        mentorIds: [mentorId]
      });
    } else {
      // Add mentor if not already in the list
      if (!application.mentorIds.includes(mentorId)) {
        application.mentorIds.push(mentorId);
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

    // Map mentors to match the expected format
    const mentors = application.mentorIds.map((mentor) => ({
      id: mentor._id,
      name: mentor.Name || '',
      title: mentor.Title || '',
      bio: mentor.Bio || '',
      avatar: mentor.Photo || 'https://i.pravatar.cc/600?img=1',
      email: mentor.email || '',
    }));

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

