import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import { Role } from "@interfaces/user.interface";
import { ChatIdDto } from "@dtos/chat.dto";
import ChatModel, { ChatDB, ChatStatus } from "@models/chat.model";
import {
  getAnswerSuggestions,
  getPrefilledMedicalRecord,
} from "@services/aiAssistant.service";

export const answerSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.authorized_user ||
      req.authorized_user.role === Role.Farmer ||
      (req.authorized_user.role === Role.Vet && !req.authorized_user.isVerified)
    ) {
      return next(
        new HttpException(
          403,
          "Only verified veterinarians have access to this feature"
        )
      );
    }
    const chatReference: ChatIdDto = req.body;
    const chat = await ChatModel.findById(chatReference.chatId);
    if (!chat) {
      return next(new HttpException(404, "Chat not found"));
    }
    if (chat.participants.indexOf(req.authorized_user.id) === -1) {
      return next(
        new HttpException(403, "User does not have access to this chat")
      );
    }
    if (chat.chatStatus !== ChatStatus.ONGOING) {
      return next(
        new HttpException(
          400,
          "AI assistants are not available. This chat is not ongoing."
        )
      );
    }
    const answers = await getAnswerSuggestions(chat);
    res.json(answers);
  } catch (e) {
    next(e);
  }
};

export const getGeneratedMedicalRecord = async (chat: ChatDB) => {
  try {
    return await getPrefilledMedicalRecord(chat);
  } catch (e) {
    console.error(e);
  }
};
