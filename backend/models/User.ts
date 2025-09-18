// backend/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "supplier" | "admin"; 
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "supplier", "admin"], // ✅ changed "seller" → "supplier"
      default: "buyer",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
