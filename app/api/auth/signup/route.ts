import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/user';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });
    console.log(user);
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
