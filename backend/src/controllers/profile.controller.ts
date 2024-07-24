import { NextFunction, Request, Response } from "express";
import ProfileModel from "@models/profile.model";
import { throwUnauthorizedError } from "src/utils/util";
import { HttpException } from "../exceptions/HttpException";
import { AddDocumentDto } from "@dtos/user.dto";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    const profile = req.params.id
      ? await ProfileModel.findOne({ userId: req.authorized_user.id })
      : await ProfileModel.findById(req.authorized_user.profileId);

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.authorized_user) {
    return throwUnauthorizedError(req);
  }

  const profileId = req.authorized_user?.profileId;
  const { firstName, lastName, profileImageUrl, bio } = req.body;

  try {
    const profile = await ProfileModel.findOneAndUpdate(
      { _id: profileId },
      { firstName, lastName, profileImageUrl, bio },
      { new: true }
    );

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// on server shutdown the socket disconnections might not be triggered
// this function sets all profiles offline
export const setAllProfilesOffline = async () => {
  try {
    await ProfileModel.updateMany({}, { nbDevicesOnline: 0 });
  } catch (err) {
    console.error(err);
  }
};

export const updateTheOnlineStatus = async (
  userId: string,
  onlineStatus: boolean
) => {
  try {
    const profile = await ProfileModel.findOne({ userId });
    if (!profile) {
      // something with the user and profile setup is wrong this should never happen!
      console.log(`Profile not found for userId: ${userId}`);
      return;
    }
    profile.nbDevicesOnline += onlineStatus ? 1 : -1;
    // 0 as limit to avoid negative values in case of server restarts
    if (profile.nbDevicesOnline < 0) {
      profile.nbDevicesOnline = 0;
    }
    if (profile.nbDevicesOnline === 0) {
      profile.lastSeenOnline = new Date();
    }
    await profile.save();
  } catch (err) {
    console.error(err);
  }
};

export const assignDocumentToCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return next(
        new HttpException(403, "Only authenticated users can upload documents")
      );
    }
    const profile = await ProfileModel.findOne({
      userId: req.authorized_user.id,
    });
    if (!profile) {
      console.log(`Profile not found for userId: ${req.authorized_user.id}`); // should never happen
      return next(new HttpException(404, "Profile not found"));
    }
    const document = req.body as AddDocumentDto;
    if (!profile.assignedDocuments) {
      profile.assignedDocuments = [];
    }
    profile.assignedDocuments.push(document);
    await profile.save();
    res.status(200).json({ message: "Document assigned successfully" });
  } catch (e) {
    next(e);
  }
};

export const getDocumentsOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return next(
        new HttpException(403, "Only authenticated users can get documents")
      );
    }

    if (!req.authorized_user.role || req.authorized_user.role !== "admin") {
      const profile = await ProfileModel.findOne({
        userId: req.authorized_user.id,
      });

      if (!profile) {
        // should never happen
        return next(new HttpException(404, "Profile not found"));
      }
      if (profile.userId !== req.authorized_user.id) {
        return next(
          new HttpException(
            403,
            "You are not allowed to get documents of other users"
          )
        );
      }
      return res.status(200).json(profile.assignedDocuments || []);
    }

    const profile = await ProfileModel.findOne({ userId: req.query.userId });

    if (!profile) {
      return next(new HttpException(404, "Profile not found"));
    }

    res.status(200).json(profile.assignedDocuments || []);
  } catch (e) {
    next(e);
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return next(
        new HttpException(403, "Only authenticated users can delete documents")
      );
    }
    const profile = await ProfileModel.findOne({
      userId: req.authorized_user.id,
    });
    if (!profile) {
      return next(new HttpException(404, "Profile not found"));
    }
    if (!profile.assignedDocuments) {
      return next(new HttpException(404, "Document not found"));
    }
    profile.assignedDocuments = profile.assignedDocuments.filter(
      (doc) => doc.path !== req.body.docId
    );
    await profile.save();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (e) {
    next(e);
  }
};

export const getProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return next(
        new HttpException(403, "Only authenticated users can get profiles")
      );
    }
    const profile = await ProfileModel.findOne({ userId: req.body.userId });
    if (!profile) {
      return next(new HttpException(404, "Profile not found"));
    }
    // mask uploaded Documents for privacy reasons
    if (req.authorized_user.role && req.authorized_user.role !== "admin") {
      profile.assignedDocuments = [];
    }
    res.status(200).json(profile);
  } catch (e) {
    next(e);
  }
};
