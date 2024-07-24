import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  assignDocumentToCurrentUserProfile,
  getDocumentsOfUser,
  getProfileByUserId,
  deleteDocument,
} from "@controllers/profile.controller";

const router = Router();

// Route to get the current user's profile
router.get("/", getUserProfile);

// Route to update the current user's profile
router.put("/", updateUserProfile);

// Assign a document to the current user profile
router.post("/assign-document", assignDocumentToCurrentUserProfile);

// Get all documents of a user
router.get("/documents", getDocumentsOfUser);

// delete a document
router.post("/delete-document", deleteDocument);

router.post("/user", getProfileByUserId);

export default router;
