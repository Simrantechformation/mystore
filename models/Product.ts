// models/Product.ts
import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: String,
  brand: String,
  stock: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', productSchema);
