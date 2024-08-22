import connectMongoDB from "@/lib/backend/db/mongodb";
import { User } from "@/lib/backend/models/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { phoneNumber } = await req.json();

  try {
    await connectMongoDB();

    // Check if the phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json({ error: "Le numéro de téléphone est déjà pris" }, { status: 400 });
    }

    return NextResponse.json({ message: "Numéro de téléphone disponible" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error checking phone number:", error.message);
      return NextResponse.json({ error: "Erreur lors de la vérification du numéro de téléphone" }, { status: 500 });
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json({ error: "Erreur inconnue lors de la vérification du numéro de téléphone" }, { status: 500 });
    }
  }
}
