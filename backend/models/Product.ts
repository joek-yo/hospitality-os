// backend/models/Product.ts

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a relationship to our User model
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false, // We'll make this optional for now
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;