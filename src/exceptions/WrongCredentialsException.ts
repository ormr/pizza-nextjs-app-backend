import { HttpException } from './HttpException';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Предоставлены неверные учетные данные');
  }
}