import multer from "multer";
import { HttpException } from "../exceptions/HttpException";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const _filenameMulter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, destination: string) => void
) => {
  const fileNameArray = file.originalname.split(".");
  const fileType = fileNameArray[fileNameArray.length - 1];

  const uniqueSuffix = `${uuidv4()}.${fileType}`;
  callback(null, file.fieldname + "-" + uniqueSuffix);
};

const _destinationMulter =
  (isPublic: boolean) =>
  (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const rootFolder: string = isPublic ? "public" : "private";
    if (!req.authorized_user) {
      return callback(
        new HttpException(403, "Unauthorized"),
        `./${rootFolder}/uploads`
      );
    }
    const path = `./${rootFolder}/uploads/${req.authorized_user.id}`;
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  };

const storagePublic = multer.diskStorage({
  destination: _destinationMulter(true),
  filename: _filenameMulter,
});

const storagePrivate = multer.diskStorage({
  destination: _destinationMulter(false),
  filename: _filenameMulter,
});

const uploadPublic = multer({
  storage: storagePublic,
  limits: { fileSize: 8000000 }, // 8Mb size limit
});

const uploadPrivate = multer({
  storage: storagePrivate,
  limits: { fileSize: 8000000 }, // 8Mb size limit
});
const deleteFile = (fullPath: string) =>
  new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(fullPath)) {
      return reject(new HttpException(404, "File to delete not found"));
    }

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(err);
        return reject(
          new HttpException(500, "Internal error during file deletion")
        );
      }

      return resolve();
    });
  });

export { uploadPrivate, uploadPublic, deleteFile };
