import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Maps errors into a json format
  if (err instanceof HttpException) {
    res
      .status(err.status)
      .send({ message: err.message, data: err.additionalData });
    return;
  }

  // Not an HttpException: Send an Internal Server Error (500)
  res.status(500).send({ message: err });
};

export default errorMiddleware;
