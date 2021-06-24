import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { OrderProduct } from './order.interface';

export class CreateOrderDto {
  list: OrderProduct[];

  @IsNumber()
  price: number;
}