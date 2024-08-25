// node --experimental-modules ./src/lib/backend/seeder/removeCATEGORYID.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {Schema}=mongoose

dotenv.config();

const categorySchema = new Schema({
    categoryID: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
  }, { timestamps: true });

  categorySchema.index({ name: 1 });


  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

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

// Seeder function
async function removeCategoryIDFromCategories() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Remove the `categoryID` field from all documents in the categories collection
    const result = await Category.updateMany(
      { categoryID: { $exists: true } }, // Find documents where categoryID exists
      { $unset: { categoryID: "" } }     // Remove the categoryID field
    );

    console.log(`Modified ${result.modifiedCount} documents by removing the categoryID field.`);
  } catch (error) {
    console.error('Error removing categoryID field:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the seeder function
removeCategoryIDFromCategories();
