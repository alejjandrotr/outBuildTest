import { IsDateString, IsNotEmpty, IsString, Length } from "class-validator";
import { Activity } from "../models/activity.interface";

export class ActivityDto implements Activity{

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name: String;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}