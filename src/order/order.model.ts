import * as mongoose from 'mongoose';
import { Order } from './order.interface';

const productCartSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: String,
  crustType: String,
  diameter: String,
  imageSrc: String,
  price: Number,
  count: Number,
  topping: [{
    name: String,
    price: String
  }]
})

const orderSchema = new mongoose.Schema({
  number: Number,
  status: String,
  list: [productCartSchema],
  price: {
    type: Number,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  time: Date
});

export const orderModel = mongoose.model<Order & mongoose.Document>('Order', orderSchema);