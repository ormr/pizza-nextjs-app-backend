import { User as UserInterface } from './src/user/user.interface';

declare global {
  namespace Express {
    interface User extends UserInterface { }
  }
}

