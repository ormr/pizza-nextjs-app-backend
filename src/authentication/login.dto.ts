import { IsString, IsPhoneNumber } from 'class-validator';

export class LogInDto {
  @IsPhoneNumber()
  public phone: string;

  @IsString()
  public password: string;
}