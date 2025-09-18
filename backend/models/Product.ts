// backend/models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  stock: number;
  supplier: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    supplier: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
