import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import Mentor from '@/models/Mentor';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { email, password, role } = await request.json();

    // Normalize inputs
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';

    // Validation
    if (!normalizedEmail || !normalizedPassword || !role) {
      return NextResponse.json(
        { message: 'Email, password and role are required' },
        { status: 400 }
      );
    }

    const userRole = role === 'mentor' ? 'mentor' : 'student';

    // Choose model based on role
    const Model = userRole === 'mentor' ? Mentor : User;

    // Find account by email
    const account = await Model.findOne({ email: normalizedEmail }).select('+password');
    // console.log("🔍 Mentor login debug — Fetched account:", account);
    if (!account) {
      // console.log('Login failed: account not found', { email: normalizedEmail, role: userRole ,password:password});
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // For students, check if user is active (mentors currently don't have this flag)
    if (userRole === 'student' && account.isActive === false) {
      return NextResponse.json(
        { message: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await account.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: account._id, email: account.email, role: userRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return account data without password
    const userData = account.toJSON();
    // Add role to user data
    userData.role = userRole;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
