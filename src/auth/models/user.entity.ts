import { IsEmail, IsOptional, Length } from "class-validator";
import { User } from "./user.interface";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsOptional() 
  @Length(6, 100)
  password?: string;
}

