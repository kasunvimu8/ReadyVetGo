import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import * as path from "path";
import { deleteFile } from "@services/file-upload.service";
import fs from "fs";
import { Role } from "@interfaces/user.interface";

export const fileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.file) {
    res.status(200).json({ status: "success", fileUrl: req.file?.path });
  } else {
    next(new HttpException(500, "Internal error"));
  }
};

export const fileDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.authorized_user;

  const filePath: string | undefined = req.query.filePath as string;

  // Validate the file path
  if (!filePath) {
    return next(new HttpException(400, "No path provided"));
  }

  // Prevent directory traversal attacks
  const basePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = path.resolve(`./${basePath}`);

  if (
    !fullPath.startsWith(path.resolve("./public")) &&
    !fullPath.startsWith(path.resolve("./private"))
  ) {
    return next(new HttpException(400, "Access denied to the path"));
  }

  if (!user) {
    return next(new HttpException(403, "Unauthorized"));
  }
  try {
    if (user.role === "admin") {
      // Can delete anything inside ./public and ./private
      await deleteFile(fullPath);
    } else {
      // Other users can only delete their own files
      const userPrivatePath = path.resolve("./private/uploads", user.id);
      const userPublicPath = path.resolve("./public/uploads", user.id);

      if (
        !fullPath.startsWith(userPrivatePath) &&
        !fullPath.startsWith(userPublicPath)
      ) {
        return next(new HttpException(403, "Unauthorized deletion attempt"));
      }

      await deleteFile(fullPath);
    }

    res.status(200).json({ status: "success", fileUrl: filePath });
  } catch (err) {
    next(err);
  }
};

export const servePrivateFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.authorized_user;
  if (!user) {
    return next(new HttpException(403, "Unauthorized", req.authorized_user));
  }

  const { userId, fileName } = req.params;

  if (!userId || !fileName) {
    return next(new HttpException(400, "Missing parameters"));
  }

  if (user.id.toString() !== userId && user.role !== Role.Admin) {
    return next(new HttpException(403, "Access denied"));
  }

  let filePath = path.join("./private", "uploads", userId, fileName);
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  const normalizedPath = path.resolve(filePath);

  if (user.role !== "admin") {
    const userPrivatePath = path.resolve("./private/uploads", user.id);
    if (!normalizedPath.startsWith(userPrivatePath)) {
      return next(new HttpException(403, "Invalid file path"));
    }
  }

  fs.access(normalizedPath, (err) => {
    if (err) {
      return next(new HttpException(404, "File not found"));
    }

    // Stream the file to the client
    res.sendFile(normalizedPath, (err) => {
      if (err) {
        next(new HttpException(500, "Error sending file"));
      }
    });
  });
};
