import { HttpException } from './HttpException';

export class AuthenticationErrorException extends HttpException {
  constructor() {
    super(401, 'Ошибка аутентификации');
  }
}