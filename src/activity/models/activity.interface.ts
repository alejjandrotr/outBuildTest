import { Schedule } from "../../schedule/models/schedule.interface";

export interface Activity {
  name: String;
  startDate: Date;
  endDate: Date;
  schedule?: Schedule;
  idOwner?: number;
}
