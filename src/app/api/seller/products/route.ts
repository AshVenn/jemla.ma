import { NextResponse } from 'next/server';
import connectMongoDb from '../../../../lib/backend/db/mongodb';
import {  Product, User, Inventory, Order, OrderItem  } from '../../../../lib/backend/models/models';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    await connectMongoDb();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ message: 'Seller ID is required' }, { status: 400 });
    }

    const userExists = await User.exists({ _id: sellerId });
    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const products = await Product.find({ sellerID: sellerId }).populate('categoryID').exec();
    const productIds = products.map(product => product._id);
    const inventories = await Inventory.find({ productID: { $in: productIds }, sellerID: sellerId });

    const productsWithInventory = products.map(product => {
      const inventory = inventories.find(inv => inv.productID.equals(product._id));
      return {
        ...product.toObject(),
        quantity: inventory ? inventory.initialQuantity : 0,
        quantityRemaining: inventory ? inventory.remainingQuantity : 0,
      };
    });

    return NextResponse.json(productsWithInventory, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDb();
    const body = await req.json();

    const { name, description, detailedDescription, basePrice, quantity, categoryID, sku, brand, tags, warranty, returnPolicy, images, sellerID } = body;

    if (!name || basePrice == null || quantity == null || !categoryID || !sellerID) {
      return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    const userExists = await User.exists({ _id: sellerID });
    if (!userExists) {
      return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    }

    const newProduct = new Product({
      name,
      description,
      detailedDescription,
      basePrice,
      categoryID,
      sku,
      brand,
      tags,
      warranty,
      returnPolicy,
      images, // Array of image URLs
      sellerID,
    });

    await newProduct.save();

    const newInventory = new Inventory({
      productID: newProduct._id,
      sellerID,
      initialQuantity: quantity,
      quantitySold: 0,
      price: basePrice,
      remainingQuantity: quantity,
    });

    await newInventory.save();

    return NextResponse.json({ message: 'Product and inventory added successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error adding product and inventory:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectMongoDb();
    const body = await req.json();
    const { productId, sellerID, name, description, detailedDescription, basePrice, quantity, categoryID, sku, brand, tags, warranty, returnPolicy, images } = body;
    const productID=productId;
    console.log('Parsed body:', body);

    // Use productID instead of _id to query
    const product = await Product.findOne({ productID, sellerID });

    if (!product) {
      console.error(`Product not found or does not belong to the seller`);
      return NextResponse.json({ message: 'Product not found or does not belong to the seller' }, { status: 404 });
    }

    // If new images are provided, delete the old images from Cloudinary
    if (images && images.length > 0) {
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map(async (imageUrl) => {
            const publicId = imageUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
              try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted image from Cloudinary: ${publicId}`);
              } catch (error) {
                console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
              }
            }
          })
        );
      }

      // Update the product's images with the new URLs
      product.images = images;
    }

    // Update other product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (detailedDescription) product.detailedDescription = detailedDescription;
    if (basePrice !== undefined) product.basePrice = basePrice;
    if (categoryID) product.categoryID = categoryID;
    if (sku) product.sku = sku;
    if (brand) product.brand = brand;
    if (tags) product.tags = tags;
    if (warranty) product.warranty = warranty;
    if (returnPolicy) product.returnPolicy = returnPolicy;

    await product.save();

    // Update the inventory associated with the product
    const inventory = await Inventory.findOne({ productID, sellerID });
    if (inventory) {
      if (quantity !== undefined) {
        const difference = quantity - inventory.initialQuantity;
        inventory.initialQuantity = quantity;
        inventory.remainingQuantity += difference; // Adjust remaining based on the difference
      }
      if (basePrice !== undefined) inventory.price = basePrice;
      await inventory.save();
    }

    return NextResponse.json({ message: 'Product and inventory updated successfully', product }, { status: 200 });
  } catch (error) {
    console.error('Error updating product and inventory:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectMongoDb();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const sellerId = searchParams.get('sellerId');

    if (!productId || !sellerId) {
      return NextResponse.json({ message: 'Product ID and Seller ID are required' }, { status: 400 });
    }

    // Check for ongoing orders
    const ongoingOrders = await OrderItem.find({ productID: productId }).populate('orderID');
    const hasOngoingOrders = ongoingOrders.some(orderItem => {
      return !['Delivered', 'Cancelled'].includes(orderItem.orderID.status);
    });

    if (hasOngoingOrders) {
      console.warn(`Product ${productId} has ongoing orders`);
      return NextResponse.json({ message: 'Cannot delete product with ongoing orders' }, { status: 400 });
    }

    // Find the product by productID and delete images from Cloudinary
    const product = await Product.findOne({ productID: productId });
    if (!product) {
      console.error(`Product ${productId} could not be found`);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    if (product.images) {
      await Promise.all(product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (error) {
          console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
        }
      }));
    }

    // Delete inventory
    await Inventory.deleteMany({ productID: productId, sellerID: sellerId });

    // Delete product
    await Product.findOneAndDelete({ productID: productId });
    console.log(`Product ${productId} deleted successfully`);

    return NextResponse.json({ message: 'Product and associated data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
