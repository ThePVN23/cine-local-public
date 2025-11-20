import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
      watchlist: [],
      screeningsHosted: [],
      screeningsAttended: []
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
