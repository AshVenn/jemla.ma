// node --experimental-modules ./src/lib/backend/seeder/admin.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

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
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
  }, { timestamps: true });

  userSchema.index({ email: 1 });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

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

// Seeder function
async function seedAdminUser() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email: 'sora7sk@gmail.com' });

    if (existingAdmin) {
      console.log('Admin with this email already exists.');
      return;
    }

    // Create a new admin user
    const passwordHash = await bcrypt.hash('adminpass1', 10); // Replace with a secure password
    const adminUser = new User({
      username: 'admin',
      firstName: 'Sora',
      lastName: 'Smith',
      passwordHash,
      email: 'sora7sk@gmail.com',
      userType: 'admin',
      isVerified: true,
    });

    await adminUser.save();
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedAdminUser();
