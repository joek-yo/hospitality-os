// backend/models/Payment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  amount: number;
  method: "COD" | "Mpesa" | "Stripe";
  status: "pending" | "completed" | "failed";
}

const PaymentSchema: Schema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["COD", "Mpesa", "Stripe"], default: "COD" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
