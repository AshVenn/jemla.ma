import { NextResponse } from 'next/server';
import connectMongoDB from "../../../lib/backend/db/mongodb";
import { Utilisateur } from "../../../lib/backend/models/models";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();
    const existingUser = await Utilisateur.findOne({ EmailUtilisateur: data.email });

    if (existingUser) {
      return NextResponse.json({ message: 'L\'utilisateur existe déjà' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 200 });
  } catch (e) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', e);
    return NextResponse.json({ message: 'Erreur lors de la vérification de l\'utilisateur' }, { status: 500 });
  }
}
