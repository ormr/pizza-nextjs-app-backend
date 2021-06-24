import 'dotenv/config';
import { App } from './app';
import { ProductController } from './product/product.controller';
import { UserController } from './user/user.controller';
import { OrderController } from './order/order.controller';
import { validateEnv } from './utils/validateEnv';
import { AuthenticationController } from './authentication/authentication.controller';

validateEnv();

const app = new App(
  [
    new ProductController(),
    new OrderController(),
    new UserController(),
    new AuthenticationController()
  ]
);

app.listen();