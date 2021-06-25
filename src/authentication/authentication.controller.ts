import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';
import { passport } from '../middleware/passport.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { Controller } from '../interfaces/controller.interface';
import { User } from '../user/user.interface';
import { CreateUserDto } from '../user/user.dto';
import { userModel } from '../user/user.model';
import { codeModel } from '../code/code.model';
import { LogInDto } from './login.dto';
import { PhoneNotAssignedException } from '../exceptions/PhoneNotAssignedException';
import { UserWithThatPhoneAlreadyExistsException } from '../exceptions/UserWithThatPhoneAlreadyExistsException';
import { WrongCredentialsException } from '../exceptions/WrongCredentialsException';
import { CodeAlreadySendException } from '../exceptions/CodeAlreadySendException';
import { CodeNotFoundException } from '../exceptions/CodeNotFoundException';
import { AccountActivationErrorException } from '../exceptions/AccountActivationErrorException';
import { SMSCodeSendingErrorException } from '../exceptions/SMSCodeSendingErrorException';
import { AuthenticationErrorException } from '../exceptions/AuthenticationErrorException';

export class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, passport.authenticate('jwt'), this.getMe);
    this.router.get(`${this.path}/sms`, passport.authenticate('jwt'), this.sendSMS);
    this.router.post(`${this.path}/sms/activate`, passport.authenticate('jwt'), this.activate)
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, passport.authenticate('local'), validationMiddleware(LogInDto), this.loggingIn);
  }

  private getMe = async (request: Request, response: Response) => {
    const user = request.user;
    user!.password = undefined;

    response.status(200).json(user);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;

    if (userData.password !== userData.password2) {
      return next(new WrongCredentialsException());
    }

    try {
      if (await this.user.findOne({ phone: userData.phone })) {
        next(new UserWithThatPhoneAlreadyExistsException(userData.phone))
      } else {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
          ...userData,
          password: hashedPassword,
          activated: false
        });

        user.password = undefined;
        response.status(201).json({
          user,
          token: this.createToken(user)
        });
      }
    } catch (error) {
      next(new WrongCredentialsException())
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = request.user ? (request?.user as User) : undefined;

      response.json({
        user,
        token: this.createToken(request.user)
      });
    } catch (error) {
      next(new AuthenticationErrorException());
    }
  }

  private activate = async (request: Request, response: Response, next: NextFunction) => {
    console.log(request.body, request.body.code);
    const userId = request.user?._id;
    const { code } = request.body;

    if (!code) {
      return response.status(400).json({ message: 'Введите код активации' });
    }
    const whereQuery = { code, user_id: userId };
    try {
      const findCode = await codeModel.findOne(whereQuery);

      if (findCode) {
        await codeModel.findOneAndDelete(whereQuery);
        const user = await userModel.findOne({ _id: userId });

        if (user) {
          user.activated = true;
          await user.save();
          response.status(200).json();
        } else {
          next(new AccountActivationErrorException());
        }


      } else {
        next(new CodeNotFoundException());
      }
    } catch (error) {
      next(new AccountActivationErrorException())
    }
  }

  private sendSMS = async (request: Request, response: Response, next: NextFunction) => {

    // SEND SMS WITH CODE TO CLIENT VIA API
    const phone = request.query.phone;
    const userId = request.user?._id;
    const smsCode = 1234;/*this.generateRandomCode(4);*/

    console.log(smsCode);
    // await sendCode(`https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79806505320&msg=${smsCode}`);

    if (!phone) {
      next(new PhoneNotAssignedException());
    }

    try {
      const findCode = await codeModel.findOne({ user_id: userId });

      if (findCode) {
        next(new CodeAlreadySendException());
      }

      const createdCode = new codeModel({
        code: smsCode,
        user_id: userId
      });

      await createdCode.save();

      response.status(200).json();
    } catch (error) {
      next(new SMSCodeSendingErrorException());
    }
  }

  private createToken(user?: User): string {
    const expiresIn = process.env.JWT_MAX_AGE!;
    const secret = process.env.JWT_SECRET!;
    const dataStoredInToken = user;

    return jwt.sign({ data: dataStoredInToken }, secret, { expiresIn })
  }

  private generateRandomCode = (length: number): number => {
    const code: number[] = [];
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 10);
      code.push(randomNumber);
    }

    return Number(code.join(''));
  }
}