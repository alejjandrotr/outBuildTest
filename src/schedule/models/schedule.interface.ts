import { Activity } from "../../activity/models/activity.interface";

export interface Schedule {
  id?: number;
  name: String;
  url: String;
  activities?: Activity[],
  idOwner?: number;
}