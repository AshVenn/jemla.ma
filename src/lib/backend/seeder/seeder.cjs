const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { Schema } = mongoose;

// MongoDB connection setup
let isConnected = false;
console.log('MongoDB URI:', process.env.MONGODB_URI);

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

// Schemas
const addressSchema = new Schema({
  addressID: { type: Schema.Types.ObjectId, auto: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true });

addressSchema.index({ userID: 1 });

const reviewSchema = new Schema({
  reviewID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  clientID: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

categorySchema.index({ name: 1 });

const orderItemSchema = new Schema({
  orderItemID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema({
  orderID: { type: Schema.Types.ObjectId, auto: true },
  clientID: { type: Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  totalAmount: { type: Number },
}, { timestamps: true });

orderSchema.index({ clientID: 1, status: 1 });

const shipmentSchema = new Schema({
  shipmentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  addressID: { type: Schema.Types.ObjectId, ref: 'Address' },
  shipmentDate: { type: Date },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
}, { timestamps: true });

const inventorySchema = new Schema({
  inventoryID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
});

const paymentSchema = new Schema({
  paymentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
  },
  amount: { type: Number, required: true },
}, { timestamps: true });

const productSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, auto: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryID: { type: Schema.Types.ObjectId, ref: 'Category' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 1 });

const userSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  userType: {
    type: String,
    enum: ['client', 'seller', 'admin'],
    required: true,
  },
  avatarImage: { type: String },
}, { timestamps: true });

userSchema.index({ email: 1 });

// Models
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Define bcrypt salt rounds for password hashing
const saltRounds = 10;

// Data for seller users
const sellersData = [
  {
    username: 'seller1',
    firstName: 'Seller',
    lastName: 'One',
    passwordHash: bcrypt.hashSync('password1', saltRounds),
    email: 'seller1@example.com',
    phoneNumber: '1234567890',
    userType: 'seller',
    avatarImage: '/avatars/seller1.jpg',
  },
  {
    username: 'seller2',
    firstName: 'Seller',
    lastName: 'Two',
    passwordHash: bcrypt.hashSync('password2', saltRounds),
    email: 'seller2@example.com',
    phoneNumber: '9876543210',
    userType: 'seller',
    avatarImage: '/avatars/seller2.jpg',
  },
];

// Data for products related to sellers
const productsData = [
  {
    name: 'Product 1 by Seller 1',
    description: 'Description for Product 1',
    price: 49.99,
    stock: 100,
    available: true,
  },
  {
    name: 'Product 2 by Seller 2',
    description: 'Description for Product 2',
    price: 29.99,
    stock: 50,
    available: true,
  },
];

// Data for categories
const categoriesData = [
  {
    name: 'Category 1',
    description: 'Description for Category 1',
  },
  {
    name: 'Category 2',
    description: 'Description for Category 2',
  },
];

// Seeder function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Insert seller users
    const insertedSellers = await User.insertMany(sellersData);

    // Map seller IDs for use in productsData
    const sellerIds = insertedSellers.map(seller => seller._id);

    // Insert categories
    const insertedCategories = await Category.insertMany(categoriesData);

    // Map category IDs for use in productsData
    const categoryIds = insertedCategories.map(category => category._id);

    // Update productsData with seller and category IDs
    productsData.forEach((product, index) => {
      product.sellerID = sellerIds[index % sellerIds.length]; // Assign seller ID
      product.categoryID = categoryIds[index % categoryIds.length]; // Assign category ID
    });

    // Insert products related to sellers
    await Product.insertMany(productsData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Ensure you only disconnect if connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run seeder function
seedDatabase();
