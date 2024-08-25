// node --experimental-modules ./src/lib/backend/seeder/featuredproducts.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;
dotenv.config();

// Product Schema
const productSchema = new mongoose.Schema({
  productID: { type: Schema.Types.ObjectId, auto: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true, maxlength: 255 },
  description: { type: String, maxlength: 1024 },
  detailedDescription: { type: String, maxlength: 5000 }, // More detailed description
  basePrice: { type: Number, required: true, min: 0 }, // Base price
  categoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }], // Array of image URLs
  attributes: [{ key: String, value: String }], // Product-specific attributes (e.g., size, color)
  sku: { type: String, unique: true }, // Stock Keeping Unit, unique identifier
  brand: { type: String }, // Brand name
  tags: [{ type: String }], // Tags for easier search and SEO
  seo: { // SEO related fields
    title: { type: String, maxlength: 255 },
    description: { type: String, maxlength: 500 },
    keywords: [{ type: String }],
  },
  available: { type: Boolean, default: true }, // Availability status
  averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating of the product
  numReviews: { type: Number, default: 0 }, // Number of reviews
  warranty: { type: String }, // Warranty information
  returnPolicy: { type: String }, // Return policy
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Indexes for efficient querying
productSchema.index({ name: 1, categoryID: 1, sku: 1 });

// Middleware to update the updatedAt field
productSchema.pre('save', function(next) {
  this.updatedAt = new Date(); 
  next();
});

// Featured Product Schema
const featuredProductSchema = new Schema({
  featuredProductID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the seller
  displayOrder: { type: Number, default: 0 }, // Order in which products should be displayed
  featuredSince: { type: Date, default: Date.now }, // Date when the product was featured
  isActive: { type: Boolean, default: true }, // To manage active/inactive featured products
  averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating for the featured product
}, { timestamps: true });

// Index for efficient querying
featuredProductSchema.index({ isActive: 1, displayOrder: 1 });

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  userType: {
    type: String,
    enum: ['client', 'seller', 'admin', 'courier'],
    required: true,
  },
  avatarImage: { type: String },
}, { timestamps: true });

userSchema.index({ email: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const FeaturedProduct = mongoose.models.FeaturedProduct || mongoose.model('FeaturedProduct', featuredProductSchema);

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
async function addSellerProductsToFeatured() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Fetch the seller user
    const seller = await User.findOne({ email: 'seller1@example.com' });
    if (!seller) {
      throw new Error('Seller not found');
    }

    // Fetch all products for the seller
    const products = await Product.find({ sellerID: seller._id });
    if (products.length === 0) {
      throw new Error('No products found for this seller');
    }

    // Loop through each product and add it to the FeaturedProduct collection
    for (const product of products) {
      const existingFeaturedProduct = await FeaturedProduct.findOne({ productID: product._id });

      if (!existingFeaturedProduct) {
        const newFeaturedProduct = new FeaturedProduct({
          productID: product._id,
          sellerID: seller._id,
          displayOrder: 0, // Default display order; adjust as needed
          isActive: true, // Mark as active
          averageRating: product.averageRating, // Set the average rating from the product
        });
        await newFeaturedProduct.save();
        console.log(`Added product to featured: ${product.name}`);
      } else {
        console.log(`Product is already featured: ${product.name}`);
      }
    }

    console.log('All seller products added to featured products.');
  } catch (error) {
    console.error('Error adding products to featured:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
addSellerProductsToFeatured();
