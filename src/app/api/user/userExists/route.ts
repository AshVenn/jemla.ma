import { NextResponse,NextRequest } from 'next/server';
import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";

export async function POST(req:NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    return NextResponse.json({ message: 'User not found' }, { status: 200 });
  } catch (e) {
    console.error('Error checking user:', e);
    return NextResponse.json({ message: 'Error checking user' }, { status: 500 });
  }
}
