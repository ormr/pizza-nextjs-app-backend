import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { Controller } from './interfaces/controller.interface';
import { loggerMiddleware } from './middleware/logger.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { passport } from './middleware/passport.middleware';

export class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initialErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(loggerMiddleware);
    this.app.use(cors({
      origin: 'https://pizza-nextjs.vercel.app',
      credentials: true,
      exposedHeaders: ["Set-Cookie"],
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({
      extended: true
    }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize())
  }

  private initializeControllers(controllers: Controller[]) {
    for (const controller of controllers) {
      this.app.use('/', controller.router);
    }
  }

  private initialErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private async connectToTheDatabase() {
    const {
      DB_USER,
      DB_USER_PASSWORD,
      DB_PATH
    } = process.env;

    const url = `mongodb+srv://${DB_USER}:${DB_USER_PASSWORD}@${DB_PATH}`;

    try {
      await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true
      });

      console.log('[app]: MongoDB connected...')
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`[app]: Server started on http://localhost:${process.env.PORT}`);
    })
  }
}