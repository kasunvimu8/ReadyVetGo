import { Router } from "express";
import { uploadPrivate, uploadPublic } from "@services/file-upload.service";
import { fileDelete, fileUpload } from "@controllers/file-upload.controller";

const router = Router();

router.post("/public", uploadPublic.single("file"), fileUpload);

router.post("/private", uploadPrivate.single("file"), fileUpload);
router.delete("/", fileDelete);

export default router;
