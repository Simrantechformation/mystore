
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      email,
      password,
      profile = {},
      preferences = { language: 'en', currency: 'USD', theme: 'light' }
    } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      profile,
      preferences,
      wishlist: []
    });

    return NextResponse.json({ message: 'User created', user: newUser, status: 200 });
  } catch (error: any) {
    const errorMessage = error.message || 'Signup failed!';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
