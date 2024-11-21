import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { User } from "../models/user.interface";

export class UserDto implements User {
  @IsEmail()
  @Length(3, 50)
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 50)
  @IsNotEmpty()
  password?: string | undefined;
}
