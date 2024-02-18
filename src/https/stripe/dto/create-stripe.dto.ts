import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';


export class CreateStripeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  unit_amount: number;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
