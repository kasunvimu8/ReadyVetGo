import ChatModel, { ChatDB, ChatStatus } from "@models/chat.model";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../exceptions/HttpException";
import { sendSystemMessage } from "../sockets/chatSocket";
import { Role } from "@interfaces/user.interface";
import { summarizeChat } from "./aiAssistant.service";

export const findChatById = async (id: string) => {
  const chat = await ChatModel.findById(id);
  if (!chat) {
    throw new HttpException(404, "Chat not found");
  }
  return chat;
};

export const createChat = async (userId: string, userRole: string) => {
  if (userRole !== Role.Farmer && userRole !== Role.Admin) {
    throw new HttpException(401, "Only authenticated farmers can create chats");
  }

  const chatID = uuidv4();
  const message_text =
    "Welcome to ReadyVetGo chat! Please provide information about your animal (Species, Breed, Color, Sex, DOB, Weight and Animal ID) and the issue you are facing.";
  const message = {
    messageText: message_text,
    isSystem: true,
    timestamp: new Date(),
  };
  const chat = new ChatModel({
    _id: chatID,
    participants: [userId],
    chatStatus: ChatStatus.OPEN,
    messages: [message],
  });

  await chat.save();
  return chat.id;
};

export const getAllOpenChats = async (userRole: string) => {
  if (userRole !== Role.Vet && userRole !== Role.Admin) {
    throw new HttpException(
      401,
      "Only authenticated veterinarians can access chats"
    );
  }

  const chats = await ChatModel.find({ chatStatus: ChatStatus.OPEN });
  return await Promise.all(
    chats.map(async (chat) => await chat.toIChatFEWithoutMessages())
  );
};

export const getAllCurrentUserChats = async (userId: string) => {
  const chats = await ChatModel.find({ participants: userId }).sort({
    createdDate: -1,
  });
  if (!chats.length) {
    throw new HttpException(404, "No chats found");
  }
  return await Promise.all(
    chats.map(async (chat) => await chat.toIChatFEWithoutMessages())
  );
};

export const getConsultationSummaryData = async (farmerId: string) => {
  const chats = await ChatModel.find({ participants: farmerId });
  if (!chats.length) {
    throw new HttpException(404, "No chats found");
  }
  const summaries = await Promise.all(
    chats.map(async (chat) => await chat.toIChatFEWithoutMessages())
  );
  return summaries.filter((summary) => summary.chatSummaryText);
};

export const assignCurrentUserToChat = async (
  chatId: string,
  userId: string,
  userEmail: string,
  userRole: string
) => {
  if (userRole !== Role.Vet && userRole !== Role.Admin) {
    throw new HttpException(
      401,
      "Only authenticated veterinarians can be assigned to chats"
    );
  }

  const chat = await findChatById(chatId);
  if (chat.chatStatus !== ChatStatus.OPEN) {
    throw new HttpException(400, "Chat is not open");
  }
  chat.chatStatus = ChatStatus.ONGOING;
  chat.participants.push(userId);
  await chat.save();
  // TODO use the user name instead of the email
  await sendSystemMessage(
    chatId,
    `The veterinarian ${userEmail} has been assigned to this case.`
  );
  return await chat.toIChatFEWithoutMessages();
};

export const getAllCurrentUserOngoingChats = async (userId: string) => {
  const chats = await ChatModel.find({
    participants: userId,
    chatStatus: ChatStatus.ONGOING,
  });
  return await Promise.all(
    chats.map((chat) => chat.toIChatFEWithoutMessages())
  );
};

export const closeChat = async (
  chatId: string,
  userId: string,
  userRole: string
) => {
  if (userRole !== Role.Vet && userRole !== Role.Admin) {
    throw new HttpException(
      401,
      "Only authenticated veterinarians can close chats"
    );
  }

  const chat = await findChatById(chatId);
  if (chat.chatStatus === ChatStatus.CLOSED) {
    throw new HttpException(400, "Chat is already closed");
  }

  if (chat.participants.indexOf(userId) === -1) {
    throw new HttpException(403, "User does not have access to this chat");
  }

  chat.chatStatus = ChatStatus.CLOSED;
  await chat.save();
  void sendSystemMessage(
    chatId,
    `This chat as been closed. If you have any further questions, please open a new chat.`
  );
  void addSummaryToChat(chatId, chat);
};

// create / update chat summary and save it to the chat
export const addSummaryToChat = async (chatId?: string, chat?: ChatDB) => {
  if (!chat) {
    if (!chatId) throw new HttpException(400, "No chat or chatId provided");
    chat = await findChatById(chatId);
  }
  const summary = await summarizeChat(chat);
  chat.chatSummaryTitle = summary.title;
  chat.chatSummaryText = summary.summary;
  await chat.save();
};
