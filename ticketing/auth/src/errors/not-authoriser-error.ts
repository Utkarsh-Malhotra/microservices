import { CustomError } from './custom-error';

export class NotAuthorisedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorised');

    Object.setPrototypeOf(this, NotAuthorisedError.prototype);
  }

  serializeError() {
    return [{ message: 'Not Authorised' }];
  }
}
