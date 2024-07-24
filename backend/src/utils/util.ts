import { NextFunction, Request, Response } from "express";
import { HttpException } from "src/exceptions/HttpException";
export const sanitizeQuery = (query: string) => {
  return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const throwUnauthorizedError = (req: Request) => {
  if (!req.authorized_user) {
    throw new HttpException(401, "Unauthorized user");
  }
};
