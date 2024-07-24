import { NextFunction, Request, Response } from "express";
import * as chatService from "@services/chat.service";
import { ChatIdDto } from "@dtos/chat.dto";
import { HttpException } from "../exceptions/HttpException";
import { Role } from "@interfaces/user.interface";
import { throwUnauthorizedError } from "src/utils/util";

export const getChatByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    const { id } = req.params;
    const chat = await chatService.findChatById(id);

    if (chat.participants.indexOf(req.authorized_user.id) === -1) {
      throw new HttpException(403, "User does not have access to this chat");
    }

    res.json(await chat.toIChatFE());
  } catch (e) {
    next(e);
  }
};

export const getAllOpenChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    if (req.authorized_user?.role === Role.Farmer) {
      throw new HttpException(
        403,
        "Only authenticated veterinarians can access chats"
      );
    }
    if (req.authorized_user?.role === Role.Vet && !req.authorized_user?.isVerified) {
      throw new HttpException(
        403,
        "Only verified veterinarians can access chats"
      );
    }
    const chats = await chatService.getAllOpenChats(req.authorized_user.role);
    res.json(chats);
  } catch (e) {
    next(e);
  }
};

export const getAllCurrentUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    const chats = await chatService.getAllCurrentUserChats(
      req.authorized_user.id
    );
    res.json(chats);
  } catch (e) {
    next(e);
  }
};

export const assignCurrentUserToChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat_reference: ChatIdDto = req.body;
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    if (req.authorized_user?.role === Role.Farmer) {
      throw new HttpException(
        403,
        "Only authenticated veterinarians can be assigned to chats"
      );
    }
    const chat = await chatService.assignCurrentUserToChat(
      chat_reference.chatId,
      req.authorized_user.id,
      req.authorized_user.email,
      req.authorized_user.role
    );
    res.json(chat);
  } catch (e) {
    next(e);
  }
};

export const getAllCurrentUserOngoingChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    const chats = await chatService.getAllCurrentUserOngoingChats(
      req.authorized_user.id
    );
    res.json(chats);
  } catch (e) {
    next(e);
  }
};

export const createNewChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    if (req.authorized_user?.role === Role.Vet) {
      throw new HttpException(
        403,
        "Only authenticated farmers can create chats"
      );
    }
    if (!req.authorized_user?.subscriptionActive) {
      throw new HttpException(
        403,
        "You do not have active subscription to create a new chat"
      );
    }
    const chatId = await chatService.createChat(
      req.authorized_user.id,
      req.authorized_user.role
    );
    res.json(chatId);
  } catch (e) {
    next(e);
  }
};

export const closeChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat_reference: ChatIdDto = req.body;
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    if (req.authorized_user?.role === Role.Farmer) {
      throw new HttpException(
        403,
        "Only authenticated veterinarians can close chats"
      );
    }
    await chatService.closeChat(
      chat_reference.chatId,
      req.authorized_user.id,
      req.authorized_user.role
    );
    res.status(200).json({ message: "Chat closed successfully" });
  } catch (e) {
    next(e);
  }
};

export const getConsultationSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }
    if (!req.params.id) {
      res.status(404).json({ message: "Farmer Id is not found" });
    }
    const chats = await chatService.getConsultationSummaryData(req.params.id);
    res.json(chats);
  } catch (e) {
    next(e);
  }
};
