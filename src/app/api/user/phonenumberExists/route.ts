//api/user/phonenumberExists
import { NextResponse, NextRequest } from 'next/server';
import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const existingUser = await User.findOne({ phoneNumber: data.phoneNumber });

    if (existingUser) {
      return NextResponse.json({ message: 'Numéro de téléphone déjà utilisé' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Numéro de téléphone disponible' }, { status: 200 });
  } catch (e) {
    console.error('Error checking phone number:', e);
    return NextResponse.json({ message: 'Erreur lors de la vérification du numéro de téléphone' }, { status: 500 });
  }
}
