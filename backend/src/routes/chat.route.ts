import { Router } from "express";
import {
  assignCurrentUserToChat,
  closeChat,
  createNewChat,
  getAllCurrentUserChats,
  getAllCurrentUserOngoingChats,
  getAllOpenChats,
  getChatByID,
  getConsultationSummary,
} from "@controllers/chat.controller";

const router = Router();

// get all open chats
router.get("/open", getAllOpenChats);

// get all ongoing chats for the current user
router.get("/ongoing", getAllCurrentUserOngoingChats);

// create a new chat
router.get("/new", createNewChat);

// assign user to chat
router.post("/assign", assignCurrentUserToChat);

// get a chat by id
router.get("/:id", getChatByID);

// close a chat
router.post("/close", closeChat);

// get all chats for the current user
router.get("/", getAllCurrentUserChats);

// get all chats for the current user
router.get("/chat-summary/:id", getConsultationSummary);

export default router;
