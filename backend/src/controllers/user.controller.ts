import { Role } from "@interfaces/user.interface";
import UserModel from "@models/user.model";
import { NextFunction, Request, Response } from "express";
import { VETERINARIAN_ROLE } from "src/constants";
import { HttpException } from "src/exceptions/HttpException";
import { throwUnauthorizedError } from "src/utils/util";
import ProfileModel, { Profile } from "@models/profile.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});

    res.json(users.map((user) => user.toFEUser()));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * returns the current user or an empty object if the user is not authenticated
 * */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return res.json({});
    }

    const userDataToFE = {};
    res.json(req.authorized_user);
  } catch (err: any) {
    next(err);
  }
};

export const getVerifyVeterinarians = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    if (req.authorized_user?.role !== Role.Admin) {
      throw new HttpException(
        403,
        "You do not have permission to perform this action"
      );
    }

    // Get all veterinarians
    const users = await UserModel.find({ role: VETERINARIAN_ROLE });

    // Get all their uuids
    const userIds = users.map((user) => user._id.toString());

    // Find all their associated profile
    const profiles = await ProfileModel.find({ userId: { $in: userIds } });

    // We reduce all those profiles into an Object: Record<userId, Profile>
    const profileMap = profiles.reduce(
      (map: Record<string, Profile>, profile) => {
        map[profile.userId] = profile;
        return map;
      },
      {}
    );

    // Finally, we take every found vet (users) and add their documents to it
    const usersWithProfiles = users.map((user) => {
      return {
        ...user.toFEUserProfile(),
        documents: profileMap[user._id.toString()]?.assignedDocuments ?? [],
      };
    });

    res.json(usersWithProfiles);
  } catch (err: any) {
    next(err);
  }
};

export const updateVerifyVeterinarians = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isVerified, id } = req.body;
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    if (req.authorized_user?.role !== Role.Admin) {
      throw new HttpException(
        403,
        "You do not have permission to perform this action"
      );
    }

    const updatedUser = await UserModel.updateOne(
      { _id: id },
      { $set: { isVerified: isVerified } }
    );

    // updating the in memory object
    req.authorized_user.isVerified = isVerified;
    if (updatedUser.modifiedCount > 0) {
      res.json({
        status: "success",
        message: "Veterinarian's verification status updated successfully.",
      });
    } else {
      next(
        new HttpException(404, "No veterinarian found with the provided id")
      );
    }
  } catch (err) {
    next(err);
  }
};
