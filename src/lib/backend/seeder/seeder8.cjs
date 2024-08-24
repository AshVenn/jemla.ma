// node --experimental-modules ./src/lib/backend/seeder/seeder8.cjs
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

// Review Schema
const reviewSchema = new Schema({
  reviewID: { type: Schema.Types.ObjectId, auto: true },
  productID: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  clientID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

// Models
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const Product = mongoose.models.Product || mongoose.model('Product', new Schema({}), 'products');
const User = mongoose.models.User || mongoose.model('User', new Schema({}), 'users');

// Seeder function
async function seedReviews() {
  try {
    // Connect to MongoDB
    await connectMongoDb();

    // Fetch the client user
    const client = await User.findOne({ email: 'client1@example.com' });
    if (!client) {
      throw new Error('Client not found');
    }

    // Array of reviews to add
    const reviews = [
      {
        productID: new mongoose.Types.ObjectId('66ab9ba8b57cf3a07521fab2'),
        clientID: client._id,
        rating: 5,
        comment: "Le HP Spectre x360 est tout simplement un ultrabook exceptionnel. Sa conception convertible le rend incroyablement polyvalent, que vous l'utilisiez comme ordinateur portable ou tablette. La performance est au rendez-vous, même pour des tâches exigeantes. L'écran est magnifique, avec des couleurs vives et une netteté impressionnante. Si vous cherchez un ultrabook haut de gamme, le Spectre x360 est un choix excellent."
      },
      {
        productID: new mongoose.Types.ObjectId('66c4b8c7bf63d9fbd2ef21de'),
        clientID: client._id,
        rating: 4,
        comment: "Ce portefeuille en cuir est à la fois élégant et pratique. Le cuir est de très bonne qualité, avec une belle finition. Il dispose de plusieurs compartiments, ce qui le rend idéal pour organiser vos cartes et billets. Le design est classique, mais reste intemporel. Un excellent choix pour ceux qui recherchent un portefeuille durable et bien conçu."
      },
      {
        productID: new mongoose.Types.ObjectId('66c4b974bf63d9fbd2ef221f'),
        clientID: client._id,
        rating: 4.5,
        comment: "Ces écouteurs sans fil offrent une excellente qualité sonore, avec une clarté impressionnante. La connectivité Bluetooth est stable et rapide, et les écouteurs sont confortables à porter même pour de longues sessions d'écoute. La durée de vie de la batterie est également très satisfaisante. Un choix parfait pour les amateurs de musique en déplacement."
      },
      {
        productID: new mongoose.Types.ObjectId('66c4ba54bf63d9fbd2ef2268'),
        clientID: client._id,
        rating: 4.5,
        comment: "Cette lampe de bureau LED est un ajout fantastique à tout espace de travail. Elle est moderne et élégante, avec une luminosité réglable qui s'adapte parfaitement à vos besoins. La température de couleur ajustable est un plus, offrant une lumière chaude ou froide selon vos préférences. Un excellent produit pour améliorer votre environnement de travail."
      }
    ];

    // Insert reviews
    for (const reviewData of reviews) {
      const existingReview = await Review.findOne({
        productID: reviewData.productID,
        clientID: reviewData.clientID,
      });

      if (!existingReview) {
        const newReview = new Review(reviewData);
        await newReview.save();
        console.log(`Added review for productID: ${reviewData.productID}`);
      } else {
        console.log(`Review for productID: ${reviewData.productID} already exists.`);
      }
    }

    console.log('Reviews seeded successfully.');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run seeder function
seedReviews();
