import mongoose, { model } from 'mongoose';
import { Product } from '../interfaces/product.interface';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  ingredients: [{
    name: String,
    canBeRemoved: Boolean,
    isRemoved: Boolean
  }],
  sizes: [{
    sizeId: String,
    sizeName: String,
    price: Number,
    diameter: Number,
    crustTypes: [{
      crustTypeId: String,
      crustTypeName: String,
      imageSrc: String,
      weight: Number,
      isDisabled: Boolean
    }]
  }],
  topping: [{
    name: String,
    imageSrc: String,
    prices: [{ sizeId: String, price: Number }],
    isDisabledFor: {
      sizes: [String],
      crustType: [String]
    }
  }],
  description: {
    type: String,
    required: false
  }
});

export const productModel = model<Product & mongoose.Document>('Product', ProductSchema);