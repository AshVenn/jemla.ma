import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongoDB from '@/lib/backend/db/mongodb';
import { User } from '@/lib/backend/models/models';
import authCheckMiddleware from '../../(middlewares)/authCheckMiddleware';

const handler = async (req) => {
  try {
    await connectMongoDB();
    const data = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, {
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user
    const newUser = new User({
      username: data.lastName,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: hashedPassword,
      email: data.email,
      phoneNumber: data.phoneNumber,
      userType: data.serviceType,
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: 'User has been registered' }, {
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: 'Error during registration' }, {
      status: 500,
    });
  }
};

export default authCheckMiddleware(handler);
