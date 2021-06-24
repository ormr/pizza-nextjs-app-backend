import { HttpException } from './HttpException';

export class SMSCodeSendingErrorException extends HttpException {
  constructor() {
    super(500, `Ошибка отправки СМС кода`);
  }
}