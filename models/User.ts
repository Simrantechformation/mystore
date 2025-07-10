import { model, models, Schema, Types } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    avatar: String,
    phone: String,
  },
  preferences: {
    language: String,
    currency: String,
    theme: { type: String, default: "light" },
  },
  wishlist: [
    {
      type: Types.ObjectId,
      ref: 'Product', // Reference to the Product model
    },
  ],
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

export const User = models.User || model('User', userSchema);
