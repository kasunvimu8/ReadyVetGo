import { NextFunction, Request, Response } from "express";
import { LoginUserDto, RegisterUserDto } from "@dtos/authentication.dto";
import bcrypt from "bcrypt";
import UserModel, { User } from "@models/user.model";
import ProfileModel, { Profile } from "@models/profile.model";
import jwt from "jsonwebtoken";
import MailService from "@services/mail.service";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../exceptions/HttpException";
import { getUserSubscriptionData } from "./subscription.controller";

const saltRounds = 10;
const emailService = new MailService();
const CryptoJS = require("crypto-js");

const _comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

const _addToken = (
  res: Response,
  req: Request,
  user: User,
  profile: Profile
) => {
  const id = user.id;
  const profileId = profile.id;
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not defined in .env file");
  const token = jwt.sign({ id, profileId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isLocalHostRequest =
    req.get("origin")?.startsWith("http://localhost:3000") ?? false;
  // We allow "sameSite: none" when coming from localhost for the dev environment, to use deployed services such as FileUploads
  const isSameSiteNone =
    process.env.FRONTEND_URL?.startsWith("https://dev.readyvetgo.de") &&
    isLocalHostRequest;

  res.cookie("token", token, {
    httpOnly: true, // Accessible only by the web server
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: isSameSiteNone ? "none" : "strict", // Helps mitigate CSRF attacks when strict
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: LoginUserDto = req.body;
    const userPromise = UserModel.findOne({ email: userData.email });
    const profilePromise = ProfileModel.findOne({
      email: userData.email,
    });
    const [user, profile] = await Promise.all([userPromise, profilePromise]);
    // fetch the user basic data profileId, firstname, lastname and store in the cache

    if (!user || !profile) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await _comparePassword(userData.password, user.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    _addToken(res, req, user, profile);

    // add the subscription status
    let isActive = false;
    if (userData.email) {
      const susbcription = await getUserSubscriptionData(userData.email);

      if (susbcription?.status === "active") {
        isActive = true;
      }
    }

    // return the user info
    res.json({
      ...user.toFEUser(),
      profileId: profile?.id,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      subscriptionActive: isActive,
    });
  } catch (err: any) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUserData: RegisterUserDto = req.body;
    if (await UserModel.findOne({ email: newUserData.email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const emailChallenge = uuidv4();

    // using random value for salt for extra security
    const hashedPassword = await bcrypt.hash(newUserData.password, saltRounds);
    const newUser = new UserModel({
      email: newUserData.email,
      password: hashedPassword,
      role: newUserData.role,
      isVerified: false,
      createdDate: new Date(),
      emailChallenge,
    });
    const newUserDoc = await newUser.save();
    // set up Profile
    const newProfile = new ProfileModel({
      userId: newUser._id,
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
    });
    await newProfile.save();
    _addToken(res, req, newUser, newProfile);
    res.json(newUser.toFEUser());

    await emailService.sendMailConfirmation(newUserDoc.email, emailChallenge);
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isLocalHostRequest =
      req.get("origin")?.startsWith("http://localhost:3000") ?? false;
    // We allow "sameSite: none" when coming from localhost for the dev environment, to use deployed services such as FileUploads
    const isSameSiteNone =
      process.env.FRONTEND_URL?.startsWith("https://dev.readyvetgo.de") &&
      isLocalHostRequest;

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isSameSiteNone ? "none" : "strict",
    });
    res.json("Logout successful");
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const emailChallenge = req.params.challenge;
  const userFound = await UserModel.findOne({ emailChallenge });

  if (!userFound) {
    return next(new HttpException(404, "No account found to verify"));
  }

  if (userFound.isEmailVerified) {
    return next(
      new HttpException(
        409,
        "Verification failed: Email has already been verified"
      )
    );
  }

  userFound.isEmailVerified = true;
  await userFound.save();

  res.json({
    status: "success",
    message: "Email verification successful.",
    data: {
      email: userFound.email,
      isEmailVerified: true,
    },
  });
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.authorized_user;
  if (!user || !user.email) {
    return next(
      new HttpException(403, "You need to be logged-in to perform this action")
    );
  }
  if (user.isEmailVerified) {
    return next(new HttpException(409, "Email already verified"));
  }

  let challenge = user?.emailChallenge;
  if (!challenge) {
    challenge = uuidv4();

    await UserModel.findByIdAndUpdate(user.id, {
      $set: { emailChallenge: challenge },
    });
  }

  await emailService.sendMailConfirmation(user.email, challenge);

  res.json({
    status: "success",
    message: "Verification email has been sent",
  });
};

export const sendResetPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = CryptoJS.SHA256(resetToken).toString();
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    await emailService.sendResetPasswordEmail(email, resetToken);

    res.json({ message: "Password reset email sent successfully" });
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  try {
    const hashedResetPasswordToken =
      CryptoJS.SHA256(resetPasswordToken).toString();
    const user = await UserModel.findOne({
      resetPasswordToken: hashedResetPasswordToken,
    });

    if (!user || !user.resetPasswordToken) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired." });
    }

    const passwordMatch = await _comparePassword(password, user.password);
    if (passwordMatch) {
      return res.status(400).json({
        message: "New password must be different from the old password.",
      });
    }

    user.password = await bcrypt.hash(password, saltRounds);
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (err: any) {
    next(err);
  }
};
