import { model, models, Schema } from "mongoose"

const ReviewSchema=new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User', required:true},
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
}, {timestamps:true})

export const Review= models.Review||model("Review", ReviewSchema)