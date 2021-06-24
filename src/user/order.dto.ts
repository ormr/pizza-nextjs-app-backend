import { IsNumber } from 'class-validator';

export class CreateOrder {
  @IsNumber()
  id: number
}