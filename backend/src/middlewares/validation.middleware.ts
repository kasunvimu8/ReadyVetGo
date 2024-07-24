import { RequestHandler } from "express";
import { validate } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { HttpException } from "../exceptions/HttpException";

export const validationMiddleware =
  (dtoType: ClassConstructor<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      let updatedBody = plainToInstance(dtoType, req.body);

      // transform and validate request body
      const validationErrors = await validate(updatedBody, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (validationErrors.length > 0) {
        next(new HttpException(400, "Validation Error", validationErrors));
        return;
      }

      req.body = updatedBody;
      next();
    } catch (err) {
      next(err);
    }
  };
