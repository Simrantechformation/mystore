import { model, models, Schema } from "mongoose";

const CategorySchema =new Schema({
name:{type:String,required:true, unique:true},
description:String,
parent:{type:Schema.Types.ObjectId, ref:'Category'},

} ,{ timestamps: true })

export const Category=models.Category|| model('Category', CategorySchema);