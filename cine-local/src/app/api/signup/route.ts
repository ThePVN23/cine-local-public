import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from '../../../../config/mongodb'; // adjust
import User from "../../models/User";          // adjust

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  await dbConnect();

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return NextResponse.json(
      { message: "Email already in use" },
      { status: 400 }
    );
  }

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
