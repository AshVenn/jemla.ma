import { NextResponse, NextRequest } from 'next/server';
import connectMongoDB from '@/lib/backend/db/mongodb';
import { User } from '@/lib/backend/models/models';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, serviceType, firstName, lastName, phoneNumber, picture, recaptchaToken } = await req.json();

    // CAPTCHA validation
    const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 400 });
    }

    await connectMongoDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save the user with hashed password
    const user = new User({
      email,
      passwordHash, // Storing the hashed password
      username,
      firstName,
      lastName,
      phoneNumber,
      userType: serviceType,
      avatarImage: picture,
      isVerified: false, // User is directly marked as verified
    });

    await user.save();

    // Construct the absolute URL for redirection using NEXTAUTH_URL
    const redirectUrl = new URL('/email-sent', process.env.NEXTAUTH_URL);

    // Redirect to the confirmation page
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
