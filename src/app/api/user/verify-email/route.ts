import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongoDB from '@/lib/backend/db/mongodb';
import { User } from '@/lib/backend/models/models';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "your-default-secret");

    const user = await User.findOneAndUpdate(
      { email: (decoded as any).email, verificationToken: token },
      { isVerified: true, verificationToken: null },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid token or user not found" }, { status: 400 });
    }

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
