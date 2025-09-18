// backend/models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  supplier: mongoose.Types.ObjectId;
  products: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
}

const OrderSchema: Schema = new Schema(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
