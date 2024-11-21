import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Schedule } from "../models/schedule.interface";

export class ScheduleDto implements Schedule{
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: String;

}