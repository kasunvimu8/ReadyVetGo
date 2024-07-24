import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import UserModel from "@models/user.model";
import { HttpException } from "../exceptions/HttpException";
import ProfileModel from "@models/profile.model";
import { getUserSubscriptionData } from "@controllers/subscription.controller";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token; // Get the token from the cookie
  if (token) {
    if (!process.env.JWT_SECRET)
      throw new Error("SECRET_KEY is not defined in .env file");
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          // If the token is invalid
          req.authorized_user = undefined;
          next();
        } else {
          try {
            // Get the user from the database
            const userPromise = UserModel.findById(decoded.id);
            const profilePromise = ProfileModel.findById(decoded.profileId);
            const [user, profile] = await Promise.all([
              userPromise,
              profilePromise,
            ]);
            if (!user || !profile) {
              // this should never happen a user tries to use a token that is not a valid user id in the database
              // access to all services will be denied
              req.authorized_user = undefined;
              next(new HttpException(401, "You are not authorized"));
            } else {
              const userData = JSON.parse(JSON.stringify(user));

              // checking the subscription status of the user
              let isActive = false;
              if (!req.authorized_user?.subscriptionActive) {
                const susbcription = await getUserSubscriptionData(
                  userData.email
                );

                if (susbcription?.status === "active") {
                  isActive = true;
                }
              }

              req.authorized_user = {
                id: userData.id,
                createdDate: userData.createdDate,
                email: userData.email,
                emailChallenge: userData.emailChallenge,
                isVerified: userData.isVerified,
                isEmailVerified: userData.isEmailVerified,
                role: userData.role,
                profileId: profile.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                subscriptionActive: isActive,
              };

              // check the user has the permission to the access API

              next();
            }
          } catch (error) {
            req.authorized_user = undefined;
            next();
          }
        }
      }
    );
  } else {
    req.authorized_user = undefined;
    next();
  }
};

export default authMiddleware;
