import { Router, Request, Response, NextFunction, request } from 'express';
import passport from 'passport';
import { Controller } from '../interfaces/controller.interface';
import { RequestWithUser } from '../interfaces/RequestWithUser.interface';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateOrderDto } from './order.dto';
import { Order, OrderStatus } from './order.interface';
import { orderModel } from './order.model';

export class OrderController implements Controller {
  public path = '/orders';
  public router = Router();
  private order = orderModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllOrders);
    this.router.post(`${this.path}`, passport.authenticate('jwt'), validationMiddleware(CreateOrderDto), this.createOrder)
    this.router.get(`${this.path}/user`, passport.authenticate('jwt'), this.getAllOrdersByUserId)
    this.router.put(`${this.path}/:id`, passport.authenticate('jwt'), this.updateOrderStatus)
    this.router.delete(`${this.path}/:id`, passport.authenticate('jwt'), this.deleteOrder);
  };

  private createOrder = async (request: Request, response: Response) => {
    const orderData: Order = request.body;
    const orderNumber = await orderModel.countDocuments();
    const userId = request.user?._id!;

    if (orderData.list.length < 1) {
      return response.status(400).json({
        status: 'error',
        message: 'Order list is empty'
      });
    }

    const newOrder: Order = {
      number: orderNumber,
      customer: userId,
      status: OrderStatus.Receive,
      list: orderData.list,
      price: orderData.price,
      time: new Date()
    }

    const createdOrder = new this.order(newOrder);

    const savedOrder = await createdOrder.save();
    await savedOrder.populate('author', '-password').execPopulate();

    response.status(201).send(savedOrder);
  }

  private getAllOrders = async (_request: Request, response: Response) => {
    const orders = await this.order.find();
    response.send(orders);
  };

  private getAllOrdersByUserId = async (request: Request, response: Response) => {
    const id = request.user?._id!;

    try {
      const orders = await this.order.find({ customer: id });
      response.send(orders);
    } catch (error) {
      response.status(404).send()
    }
  };

  private updateOrderStatus = async (request: Request, response: Response) => {
    const id = request.params.id;
    const orderStatus: OrderStatus = request.body.status;

    try {
      const order = await this.order.findById(id);
      if (order) {
        order.status = orderStatus;
        await order.save();
        response.send(order);
      }
    } catch (error) {
      response.status(404).send()
    }
  };

  private deleteOrder = async (request: Request, response: Response) => {
    const id = request.params.id;

    try {
      await this.order.findByIdAndDelete(id);
      response.status(200).send()
    } catch (error) {
      response.status(404).send()
    }
  };
};