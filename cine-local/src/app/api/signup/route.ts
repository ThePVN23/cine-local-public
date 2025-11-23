import { NextResponse } from "next/server";
// FIX: Use bcryptjs to match your installed package
import bcrypt from "bcryptjs"; 
import dbConnect from '../../../../config/mongodb';
import User from "../../models/User";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  await dbConnect();

  // Check for existing email
  const existingEmail = await User.findOne({ email }).lean();
  if (existingEmail) {
    return NextResponse.json(
      { message: "Email already in use" },
      { status: 400 }
    );
  }

  // FIX: Check for existing username to prevent 500 Crash
  const existingUsername = await User.findOne({ username }).lean();
  if (existingUsername) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
      watchlist: [],
      screeningsHosted: [],
      screeningsAttended: []
    });

    return NextResponse.json(
      { message: "User created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}