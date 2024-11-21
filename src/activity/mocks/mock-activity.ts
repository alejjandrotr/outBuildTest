import { ActivityDto } from "../dtos/activity.dto";
import { ActivityEntity } from "../models/activity.entity";

export function mockActivity(): ActivityDto {
  return {
    name: "Activity",
    startDate: new Date("2024-11-13T10:00"),
    endDate: new Date("2024-11-13T14:00"),
  };
}

export function mockActivityEntity(): ActivityEntity {
  return {
    id: 1,
    name: "Activity",
    startDate: new Date("2024-11-13T10:00"),
    endDate: new Date("2024-11-13T14:00"),
    idOwner: 1,
  };
}
