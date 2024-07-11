import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongoDb from '../../../../lib/mongodb';
import { Utilisateur } from '../../../../backend/models/models';

export async function POST(req) {
  try {
    await connectMongoDb();
    const data = await req.json();

    // Check if the user already exists
    const existingUser = await Utilisateur.findOne({ EmailUtilisateur: data.email });
    if (existingUser) {
      return NextResponse.json({ message: 'L\'utilisateur existe déjà' }, {
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user
    const newUser = new Utilisateur({
      NomUtilisateur: data.lastName,
      PrenomUtilisateur: data.firstName,
      MotDePasseHash: hashedPassword,
      EmailUtilisateur: data.email,
      NumeroTelephone: data.phoneNumber,
      TypeUtilisateur: data.serviceType,
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: 'Utilisateur a été inscrit' }, {
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: 'Erreur lors de l\'inscription' }, {
      status: 500,
    });
  }
}
