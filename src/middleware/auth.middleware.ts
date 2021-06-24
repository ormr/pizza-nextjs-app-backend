import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticationTokenMissingException } from '../exceptions/AuthenticationTokenMissingException';
import { WrongAuthenticationTokenException } from '../exceptions/WrongAuthenticationTokenException';
import { DataStoredInToken } from '../interfaces/dataStoredInToken.interface';
import { RequestWithUser } from '../interfaces/RequestWithUser.interface';
import { userModel } from '../user/user.model';

export const authMiddleware = async (request: Request, _response: Response, next: NextFunction) => {
  const requestWithUser = request as RequestWithUser;
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET!;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);

      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}