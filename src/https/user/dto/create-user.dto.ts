import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsStrongPassword,
  IsUrl,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateIf,
  IsDateString,
  IsArray,
} from 'class-validator';

import { UserRole } from 'src/enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  // The above properties are common to all users (students, uniMods, superAdmins.)

  // The below properties are specific to Students only.
  @ValidateIf((object, value) => object.role === UserRole.STUDENT)
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth?: string;

  @ValidateIf((object, value) => object.role === UserRole.STUDENT)
  @IsNotEmpty()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: string;

  @ValidateIf((object, value) => object.role === UserRole.STUDENT)
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  // @IsArray()
  @IsString()
  languages?: any;

  @ValidateIf((object, value) => object.role === UserRole.STUDENT)
  @IsString()
  @IsNotEmpty()
  universityID?:number;

  // A uni mod can or can not have a uniID & superAdmins don't have a uniID
  @IsString()
  @IsOptional()
  uniID?:number;

  @IsString()
  @IsOptional()
  companyID?:number;
}
