export class ErrorUserAlredyExist extends Error {
  constructor(email: String) {
    super(`The email ${email} alredy exist`);
    this.name = "ErrorUserAlredyExist";
  }
}

