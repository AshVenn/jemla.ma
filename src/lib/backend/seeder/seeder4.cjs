// node --experimental-modules ./src/lib/backend/seeder/seeder3.cjs
// seeder4.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
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

// Schemas
const orderItemSchema = new Schema({
  orderItemID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema({
  orderID: { type: Schema.Types.ObjectId, auto: true },
  clientID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  totalAmount: { type: Number },
}, { timestamps: true });

const userSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, auto: true },
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

const productSchema = new Schema({
  productID: { type: Schema.Types.ObjectId, auto: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryID: { type: Schema.Types.ObjectId, ref: 'Category' },
  available: { type: Boolean, default: true },
  images: [{ type: String }], // Array of image URLs
}, { timestamps: true });

// Models
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Seeder function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Fetch seller1
    const seller1 = await User.findOne({ email: 'seller1@example.com' });
    if (!seller1) {
      throw new Error('Seller1 not found');
    }

    // Fetch products for seller1
    const products = await Product.find({ sellerID: seller1._id });
    if (!products.length) {
      throw new Error('No products found for seller1');
    }

    // Create a new client
    const clientData = {
      username: 'client1',
      firstName: 'Client',
      lastName: 'One',
      passwordHash: bcrypt.hashSync('clientpassword', 10),
      email: 'client1@example.com',
      phoneNumber: '1122334455',
      userType: 'client',
      avatarImage: 'https://example.com/avatar/client1.jpg',
    };

    let client = await User.findOne({ email: clientData.email });
    if (!client) {
      client = new User(clientData);
      await client.save();
    }

    // Function to create a random integer between min and max (inclusive)
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate random orders for the new client
    const ordersData = [
      { clientID: client._id, sellerID: seller1._id, status: 'Pending', totalAmount: 0 },
      { clientID: client._id, sellerID: seller1._id, status: 'Processed', totalAmount: 0 },
      { clientID: client._id, sellerID: seller1._id, status: 'Shipped', totalAmount: 0 },
      
      // Add more orders as needed
    ];

    // Insert orders and order items
    for (const orderData of ordersData) {
      // Create a new order
      const newOrder = new Order(orderData);
      await newOrder.save();

      // Create a random selection of products for this order
      const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, getRandomInt(1, products.length));

      let totalAmount = 0;
      for (const product of selectedProducts) {
        const quantity = getRandomInt(1, 5); // Random quantity between 1 and 5
        const price = product.basePrice * quantity; // Use basePrice instead of price
        totalAmount += price;

        // Create a new order item
        const orderItemData = {
          orderID: newOrder._id,
          productID: product._id,
          quantity,
          price,
        };

        const newOrderItem = new OrderItem(orderItemData);
        await newOrderItem.save();
      }

      // Update the total amount for the order
      newOrder.totalAmount = totalAmount;
      await newOrder.save();
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedDatabase();
