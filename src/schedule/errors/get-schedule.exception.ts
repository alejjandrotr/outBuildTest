export class ErrorScheduleGetShedule extends Error {
  constructor(idOwner: number | string) {
    super(`An unexpected error happend whe we try to get ${idOwner} Schedules`);
    this.name = "ErrorScheduleGetShedule";
  }
}
