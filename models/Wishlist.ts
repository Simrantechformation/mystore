import { model, models, Schema, Types } from "mongoose";



const WishlistSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);


  export const Wishlist=models.Wishlist||model("Wishlist", WishlistSchema)