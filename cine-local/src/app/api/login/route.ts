import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import dbConnect from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      { message: 'Login successful', user: userObj },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
