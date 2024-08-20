// node --experimental-modules ./src/lib/backend/seeder/seeder7.cjs
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
const addressSchema = new Schema({
  addressID: { type: Schema.Types.ObjectId, auto: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true });

const shipmentSchema = new Schema({
  shipmentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  addressID: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
  shipmentDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  trackingNumber: { type: String },
  shippingMethod: { type: String }, 
  shippingCost: { type: Number },
}, { timestamps: true });

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
    default: 'Shipped',
  },
  totalAmount: { type: Number },
  shipmentID: { type: Schema.Types.ObjectId, ref: 'Shipment' }, // Link to Shipment
  paymentID: { type: Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

const paymentSchema = new Schema({
  paymentID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
    required: true,
  },
  amount: { type: Number, required: true },
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
const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Seeder function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Fetch the client
    const client = await User.findOne({ email: 'client1@example.com' });
    if (!client) {
      throw new Error('Client not found');
    }

    // Delete existing shipped orders and related order items
    const shippedOrders = await Order.find({ clientID: client._id, status: 'Shipped' });
    const orderIDs = shippedOrders.map(order => order._id);

    await OrderItem.deleteMany({ orderID: { $in: orderIDs } });
    await Order.deleteMany({ _id: { $in: orderIDs } });
    await Shipment.deleteMany({ orderID: { $in: orderIDs } });
    await Payment.deleteMany({ orderID: { $in: orderIDs } });

    console.log(`Deleted ${shippedOrders.length} shipped orders and related order items.`);

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

    // Add an address for the client
    const addressData = {
      userID: client._id,
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    };

    let address = await Address.findOne({ userID: client._id });
    if (!address) {
      address = new Address(addressData);
      await address.save();
    }

    // Create three new shipped orders with random products and payments
    for (let i = 1; i <= 3; i++) {
      const orderDate = new Date();
      orderDate.setMonth(orderDate.getMonth() - i);

      const newOrder = new Order({
        clientID: client._id,
        sellerID: seller1._id,
        status: 'Shipped',
        totalAmount: 0, // Initialize as 0, we'll calculate it
        createdAt: orderDate,
        updatedAt: orderDate,
      });
      await newOrder.save();

      const newShipment = new Shipment({
        orderID: newOrder._id,
        addressID: address._id,
        shipmentDate: orderDate,
        status: 'Shipped',
        trackingNumber: `TRACK${i}123456789`,
        shippingMethod: 'Standard',
        shippingCost: 50,
      });
      await newShipment.save();

      newOrder.shipmentID = newShipment._id;
      await newOrder.save();

      // Randomly select products and create order items
      let totalAmount = 0;
      const randomProducts = getRandomElements(products, getRandomInt(1, 3)); // Get 1 to 3 random products

      for (const product of randomProducts) {
        const quantity = getRandomInt(1, 5); // Random quantity between 1 and 5
        const itemTotal = product.basePrice * quantity;

        const orderItemData = {
          orderID: newOrder._id,
          productID: product._id,
          quantity,
          price: itemTotal,
        };

        const newOrderItem = new OrderItem(orderItemData);
        await newOrderItem.save();

        totalAmount += itemTotal;
      }

      // Update the order's total amount
      newOrder.totalAmount = totalAmount;
      await newOrder.save();

      // Add a payment for the order
      const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer'];
      const randomPaymentMethod = paymentMethods[getRandomInt(0, paymentMethods.length - 1)];

      const newPayment = new Payment({
        orderID: newOrder._id,
        paymentMethod: randomPaymentMethod,
        amount: totalAmount,
      });
      await newPayment.save();

      // Link the payment to the order
      newOrder.paymentID = newPayment._id;
      await newOrder.save();

      console.log(`Created order ${newOrder._id} with a total of ${totalAmount}€ and ${randomProducts.length} products and payment of ${totalAmount}€ via ${randomPaymentMethod}`);
    }

    console.log('Database seeded successfully with 3 new shipped orders and payments for client1@example.com.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Function to create a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to get random elements from an array
const getRandomElements = (array, numElements) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
};

// Run seeder function
seedDatabase();
