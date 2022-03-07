import { CustomError } from './custom-error';

export class BadRequestErrors extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestErrors.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
