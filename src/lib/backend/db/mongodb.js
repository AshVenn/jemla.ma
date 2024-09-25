import mongoose from 'mongoose';

let isConnected = false; // track the connection status

// Enhanced MongoDB connection function
const connectMongoDb = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Listen for successful connection
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    // Listen for connection errors
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    // Listen for disconnections
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });

    // Check for open state (1 means connected)
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      console.log('Connected to MongoDB');
    }

    // Log registered models
    console.log('Registered Mongoose Models:', mongoose.models);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectMongoDb;
