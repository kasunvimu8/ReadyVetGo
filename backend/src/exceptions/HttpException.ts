export class HttpException<T> extends Error {
  status: number;
  message: string;
  additionalData?: T;

  constructor(status: number, message: string, additionalData?: T) {
    super(message);
    this.status = status;
    this.message = message;
    this.additionalData = additionalData;
  }
}
