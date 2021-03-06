import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';

export const errorMiddleware = (error: HttpException, _request: Request, response: Response, _next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).send({ status, message });
}