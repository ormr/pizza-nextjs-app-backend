import { IsString, IsPhoneNumber } from 'class-validator';
import { CreateOrder } from './order.dto';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsString()
  public surname: string;

  @IsString()
  public password: string;

  @IsString()
  public password2: string;

  @IsString()
  public address: string;

  @IsPhoneNumber()
  public phone: string;
}