import { HttpException } from './HttpException';

export class PhoneNotAssignedException extends HttpException {
  constructor() {
    super(400, 'Номер телефона не указан');
  }
}