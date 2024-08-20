  import mongoose, { Schema } from 'mongoose';

  // Address Schema
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

  // Review Schema
  const reviewSchema = new Schema({
    reviewID: { type: Schema.Types.ObjectId, auto: true },
    productID: { type: Schema.Types.ObjectId, ref: 'Product' },
    clientID: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  }, { timestamps: true });

  // Category Schema
  const categorySchema = new Schema({
    categoryID: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    description: { type: String },
  }, { timestamps: true });

  categorySchema.index({ name: 1 });

 // OrderItem Schema
const orderItemSchema = new Schema({
  orderItemID: { type: Schema.Types.ObjectId, auto: true },
  orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
  productID: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Order Schema
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
  orderItems: [orderItemSchema],  // Include orderItems directly in the Order schema
  shipmentID: { type: Schema.Types.ObjectId, ref: 'Shipment' },
}, { timestamps: true });

orderSchema.index({ clientID: 1, sellerID: 1, status: 1 });

  // Shipment Schema
  const shipmentSchema = new Schema({
    shipmentID: { type: Schema.Types.ObjectId, auto: true },
    orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    addressID: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    courierID: { type: Schema.Types.ObjectId, ref: 'Courier' }, // Optional: link to the courier
    shipmentDate: { type: Date, default: Date.now }, // Date when the shipment is created
    deliveryDate: { type: Date }, // Date when the shipment is delivered
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    trackingNumber: { type: String }, // Optional: Tracking number for the shipment
    shippingMethod: { type: String }, // Optional: e.g., 'Standard', 'Express'
    shippingCost: { type: Number }, // Optional: Cost of shipping
  }, { timestamps: true });

  // Courier Schema
  const courierSchema = new Schema({
    courierID: { type: Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    vehicle: { type: String },
  }, { timestamps: true });

  courierSchema.index({ email: 1 });

  // Inventory Schema
  const inventorySchema = new mongoose.Schema({
    inventoryID: { type: Schema.Types.ObjectId, auto: true },
    productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initialQuantity: { type: Number, required: true }, // Initial stock level when the inventory record is created
    quantitySold: { type: Number, default: 0 }, // Quantity sold so far
    price: { type: Number, required: true }, // Seller-specific price
    lastRestockDate: { type: Date }, // Date of the last restock
    lastUpdateDate: { type: Date, default: Date.now }, // Last update timestamp
    status: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Discontinued'],
      default: 'In Stock',
    }, // Status of the product
  }, { timestamps: true });
  
  // Calculate remaining quantity dynamically based on initial quantity and quantity sold
  inventorySchema.virtual('remainingQuantity').get(function() {
    return this.initialQuantity - this.quantitySold;
  });
  
  // Ensure lastUpdateDate is updated whenever the document is saved
  inventorySchema.pre('save', function(next) {
    this.lastUpdateDate = Date.now();
    next();
  });
  
  // Create indexes for efficient querying
  inventorySchema.index({ productID: 1, sellerID: 1 });

  // Payment Schema
  const paymentSchema = new Schema({
    paymentID: { type: Schema.Types.ObjectId, auto: true },
    orderID: { type: Schema.Types.ObjectId, ref: 'Order' },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
    },
    amount: { type: Number, required: true },
  }, { timestamps: true });

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
    this.updatedAt = Date.now();
    next();
  });
  
  

  // User Schema
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

  userSchema.index({ email: 1 });

  const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);
  const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
  const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', orderItemSchema);
  const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
  const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
  const Courier = mongoose.models.Courier || mongoose.model('Courier', courierSchema);
  const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
  const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  export {
    Address,
    Review,
    Category,
    OrderItem,
    Order,
    Shipment,
    Courier,
    Inventory,
    Payment,
    Product,
    User,
  };
