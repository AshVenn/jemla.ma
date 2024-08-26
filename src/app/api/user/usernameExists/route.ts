//api/user/usernameExists
import { NextResponse, NextRequest } from 'next/server';
import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const existingUser = await User.findOne({ username: data.username });

    if (existingUser) {
      return NextResponse.json({ message: "Nom d'utilisateur déjà utilisé" }, { status: 400 });
    }

    return NextResponse.json({ message: "Nom d'utilisateur disponible" }, { status: 200 });
  } catch (e) {
    console.error("Error checking username:", e);
    return NextResponse.json({ message: "Erreur lors de la vérification du nom d'utilisateur" }, { status: 500 });
  }
}
