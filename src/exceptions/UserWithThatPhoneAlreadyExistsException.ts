import { HttpException } from './HttpException';

export class UserWithThatPhoneAlreadyExistsException extends HttpException {
  constructor(phone: string) {
    super(400, `Пользователь с номером ${phone} уже существует`);
  }
}