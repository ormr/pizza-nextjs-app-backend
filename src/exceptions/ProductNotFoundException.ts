import { HttpException } from './HttpException';

export class ProductNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Продукт с ID: ${id} не найден`);
  }
}