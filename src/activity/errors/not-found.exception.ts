export class ErrorActivityNotFound extends Error {
  constructor(id: number) {
    super(`Activity with ID ${id} not found.`);
    this.name = "ErrorActivityNotFound";
  }
}