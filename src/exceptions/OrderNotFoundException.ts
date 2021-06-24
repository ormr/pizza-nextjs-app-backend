import { HttpException } from './HttpException';

export class OrderNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Заказ с ID: ${id} не найден`);
  }
}