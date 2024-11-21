import { ScheduleDto } from "../dtos/schedule.dto";
import { ScheduleEntity } from "../models/schedule.entity";

export function mockSchedule(): ScheduleDto {
  return {
    name: "Schedule 1",
    url: "imagen.png",
  };
}

export function mockScheduleEntity(): ScheduleEntity {
  return {
    id: 1,
    name: "Schedule 1",
    url: "imagen.png",
    idOwner: 1
  };
}