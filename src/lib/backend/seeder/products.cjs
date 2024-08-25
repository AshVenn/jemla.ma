// node --experimental-modules ./src/lib/backend/seeder/products.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema } = mongoose;
dotenv.config();

const categorySchema = new Schema({
    categoryID: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
  }, { timestamps: true });

  categorySchema.index({ name: 1 });

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


      const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
      const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
      const User = mongoose.models.User || mongoose.model('User', userSchema);


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
async function seedProductsForSeller() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Fetch the seller user
    const seller = await User.findOne({ email: 'seller1@example.com' });
    if (!seller) {
      throw new Error('Seller not found');
    }

    // Fetch all categories
    const categories = await Category.find();
    if (categories.length === 0) {
      throw new Error('No categories found');
    }

    // Loop through each category and add 3 products for the seller
    for (const category of categories) {
      const products = [
        {
          sellerID: seller._id,
          name: `${category.name} Product 1`,
          description: `Description for ${category.name} Product 1`,
          detailedDescription: `Detailed description for ${category.name} Product 1`,
          basePrice: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 110
          categoryID: category._id,
          images: [`/images/${category.name.toLowerCase()}1.jpg`],
          sku: `${category.name.toUpperCase()}1-${Date.now()}`, // Unique SKU
          brand: `${category.name}Brand`,
          tags: [`${category.name}`, 'wholesale'],
        },
        {
          sellerID: seller._id,
          name: `${category.name} Product 2`,
          description: `Description for ${category.name} Product 2`,
          detailedDescription: `Detailed description for ${category.name} Product 2`,
          basePrice: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 110
          categoryID: category._id,
          images: [`/images/${category.name.toLowerCase()}2.jpg`],
          sku: `${category.name.toUpperCase()}2-${Date.now()}`, // Unique SKU
          brand: `${category.name}Brand`,
          tags: [`${category.name}`, 'wholesale'],
        },
        {
          sellerID: seller._id,
          name: `${category.name} Product 3`,
          description: `Description for ${category.name} Product 3`,
          detailedDescription: `Detailed description for ${category.name} Product 3`,
          basePrice: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 110
          categoryID: category._id,
          images: [`/images/${category.name.toLowerCase()}3.jpg`],
          sku: `${category.name.toUpperCase()}3-${Date.now()}`, // Unique SKU
          brand: `${category.name}Brand`,
          tags: [`${category.name}`, 'wholesale'],
        },
      ];

      // Insert products
      for (const productData of products) {
        const existingProduct = await Product.findOne({ sku: productData.sku });

        if (!existingProduct) {
          const newProduct = new Product(productData);
          await newProduct.save();
          console.log(`Added product: ${productData.name}`);
        } else {
          console.log(`Product with SKU: ${productData.sku} already exists.`);
        }
      }
    }

    console.log('Products seeded successfully for each category.');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedProductsForSeller();