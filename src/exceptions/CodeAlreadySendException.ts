import { HttpException } from './HttpException';

export class CodeAlreadySendException extends HttpException {
  constructor() {
    super(400, 'Код уже был отправлен');
  }
}