import { Router, Request, Response, NextFunction } from 'express';
import { Product } from './product.interface';
import { Controller } from '../interfaces/controller.interface';
import { productModel } from './product.model';
import { ProductNotFoundException } from '../exceptions/ProductNotFoundException';


export class ProductController implements Controller {
  public path = '/products';
  public router = Router();
  private product = productModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getAllProducts);
    this.router.get(`${this.path}`, this.getProductById);
    this.router.post(`${this.path}`, this.createProduct);
  }

  private getAllProducts = async (_request: Request, response: Response) => {
    const products = await this.product.find();
    response.json(products);
  }

  private getProductById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    try {
      const product = await this.product.findById(id);
      response.json(product);
    } catch (err) {
      next(new ProductNotFoundException(id));
    }
  }

  private createProduct = async (request: Request, response: Response, next: NextFunction) => {
    const productData: Product = request.body;

    await this.product.create(productData, (err) => {
      if (err) return next(err);
      return response.json(productData);
    });
  }
}