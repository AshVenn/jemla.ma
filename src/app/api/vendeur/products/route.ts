import { NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import {Produit,Utilisateur} from '../../../../lib/backend/models/models';

export async function GET(req: Request) {
  try {
    await connectMongoDb();

    const { searchParams } = new URL(req.url);
    const vendeurId = searchParams.get('vendeurId');

    if (!vendeurId) {
      return NextResponse.json({ message: 'Le vendeurId est requis' }, {
        status: 400,
      });
    }

    const userExists = await Utilisateur.exists({ _id: vendeurId });
    if (!userExists) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, {
        status: 404,
      });
    }

    const produits = await Produit.find({ VendeurID: vendeurId }).populate('CategorieID').exec();

    return NextResponse.json(produits, {
      status: 200,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, {
      status: 500,
    });
  }
}
