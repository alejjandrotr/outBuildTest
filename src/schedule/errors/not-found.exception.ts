export  class ErrorScheduleNotFound extends Error {
  constructor(id: number | string) {
      super(`SCHEDULE with ID ${id} cannot be found`);
      this.name = 'ErrorScheduleNotFound';
  }
}