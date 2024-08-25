// node --experimental-modules ./src/lib/backend/seeder/categories.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;

dotenv.config();

// MongoDB connection setup
let isConnected = false;

const connectMongoDb = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// Category Schema
const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

// Models
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Seeder function
async function seedCategories() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Array of categories to add
    const categories = [
      {
        name: 'Électronique',
        description: 'Appareils électroniques, gadgets, et accessoires.',
      },
      {
        name: 'Vêtements',
        description: 'Habillement, accessoires de mode, et chaussures.',
      },
      {
        name: 'Produits de beauté',
        description: 'Cosmétiques, soins de la peau, et produits de beauté.',
      },
      {
        name: 'Meubles',
        description: 'Mobilier de maison, de bureau, et accessoires de décoration.',
      },
      {
        name: 'Alimentation',
        description: 'Produits alimentaires, boissons, et snacks.',
      },
      {
        name: 'Jouets',
        description: 'Jouets pour enfants, jeux de société, et articles de loisirs.',
      },
      {
        name: 'Papeterie',
        description: 'Fournitures de bureau, cahiers, et outils d\'écriture.',
      },
      {
        name: 'Équipements sportifs',
        description: 'Articles de sport, vêtements de sport, et accessoires de fitness.',
      },
      {
        name: 'Produits ménagers',
        description: 'Produits de nettoyage, outils de cuisine, et articles ménagers divers.',
      },
    ];

    // Insert categories
    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });

      if (!existingCategory) {
        const newCategory = new Category(categoryData);
        await newCategory.save();
        console.log(`Added category: ${categoryData.name}`);
      } else {
        console.log(`Category: ${categoryData.name} already exists.`);
      }
    }

    console.log('Categories seeded successfully.');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedCategories();
