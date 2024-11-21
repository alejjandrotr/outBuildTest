
export class ErrorInvalidCredentials extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "ErrorInvalidCredentials";
  }
}
