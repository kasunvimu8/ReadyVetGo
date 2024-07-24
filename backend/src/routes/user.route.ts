import { Router } from "express";
import {
  getAllUsers, getCurrentUser,
  getVerifyVeterinarians,
  updateVerifyVeterinarians,
} from "@controllers/user.controller";
import { UpdateVerifyVetDto } from "@dtos/user.dto";
import { validationMiddleware } from "@middlewares/validation.middleware";

const router = Router();

// Route to get all users
router.get("/all", getAllUsers);
router.get("/verify-vet", getVerifyVeterinarians);
router.put(
  "/verify-vet",
  validationMiddleware(UpdateVerifyVetDto),
  updateVerifyVeterinarians
);

router.get("/currentUser", getCurrentUser);

export default router;
