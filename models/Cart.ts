import mongoose, { model, models, Schema } from "mongoose";

const CartSchema = new Schema({
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
}, {timestamps: true})

export const Cart= models.Cart || model("Cart", CartSchema)