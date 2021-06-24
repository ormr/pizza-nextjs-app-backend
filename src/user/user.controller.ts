import { Router, Request, Response, NextFunction } from 'express';
import { Controller } from '../interfaces/controller.interface';
import { userModel } from './user.model';

export class UserController implements Controller {
  public path = '/user';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/${this.path}/:id/orders`, this.modifyUser);
  }

  private modifyUser = async (requst: Request, response: Response, next: NextFunction) => {
    response.send(202);
  }
}