import { Router } from "express";
import {
  login,
  logout,
  register,
  resendVerificationEmail,
  verifyEmail,
  sendResetPasswordEmail,
  resetPassword
} from "@controllers/authentication.controller";

const router = Router();

// Route to login a user
router.post("/login", login);

// Route to register a user
router.post("/register", register);

// Route to logout a user
router.post("/logout", logout);

router.post("/verify-email/:challenge", verifyEmail);
router.get("/resend-verify-email", resendVerificationEmail);

router.post("/reset-password/:resetPasswordToken", resetPassword);
router.post("/send-reset-password-email", sendResetPasswordEmail);

export default router;
