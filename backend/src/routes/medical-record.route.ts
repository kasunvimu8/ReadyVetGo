import { Router } from "express";
import { validationMiddleware } from "@middlewares/validation.middleware";
import {
  createMedicalRecord,
  generateMedicalRecord,
  getMedicalRecordById,
  getMedicalRecords,
} from "@controllers/medical-record.controller";
import { CreateMedicalRecordDto } from "@dtos/medical-record.dto";

const router = Router();

router.post(
  "/create",
  validationMiddleware(CreateMedicalRecordDto),
  createMedicalRecord
);

router.get("/", getMedicalRecords);
router.get("/:id", getMedicalRecordById);
router.get("/generate/:chatId", generateMedicalRecord);

export default router;
