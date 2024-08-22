import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth/authOptions";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, firstName, lastName, email, phoneNumber, avatarImage } = await req.json();

  try {
    await connectMongoDB();

    // Basic validation
    if (!email || !phoneNumber) {
      return NextResponse.json({ error: "Email and phone number are required" }, { status: 400 });
    }

    // Ensure the phone number is valid
    if (!/^(\+212)\d{9}$/.test(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { username, firstName, lastName, email, phoneNumber, avatarImage },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
