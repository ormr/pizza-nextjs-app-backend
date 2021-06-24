import { HttpException } from './HttpException';

export class CodeNotFoundException extends HttpException {
  constructor() {
    super(403, 'Код не найден');
  }
}