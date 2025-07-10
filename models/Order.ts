import { model, models, Schema } from "mongoose";

const OrderSchema=new Schema({
user:{type:Schema.Types.ObjectId, ref:'User', required:true},
products:[{
   product: {type:Schema.Types.ObjectId, ref:'Product', required:true},
   quantity:Number,
}],
total:{type:Number, required:true},
status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
},{timestamps:true})

export const Order= models.Order||model("Order", OrderSchema);