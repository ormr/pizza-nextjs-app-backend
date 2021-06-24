import { HttpException } from './HttpException';

export class AccountActivationErrorException extends HttpException {
  constructor() {
    super(401, 'Ошибка активации аккаунта');
  }
}