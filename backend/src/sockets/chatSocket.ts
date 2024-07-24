import { Socket, Server } from 'socket.io';
import ChatModel, { IChatMessageDB, IChatMessageFE, IChatMessageReceived, SYSTEM_USER_ID } from "@models/chat.model";
import { io } from 'io'
import { addSummaryToChat } from "@services/chat.service";

export default (socket: Socket, io: Server) => {

  socket.on('sendMessage', async (rawMessage: IChatMessageReceived) => {
    const chat = await ChatModel.findById(rawMessage.chatID);
    if (!chat) {
      // this should never happen the client is doing something fishy or the database is corrupted
      socket.emit('errorEvent', 'Chat not found');
      return;
    }
    if (!chat.participants.includes(socket.data.authorized_user.id)) {
      // the user is not part of the chat - this should never happen
      socket.emit('errorEvent', 'User not part of the chat');
      return;
    }
    if (chat.chatStatus === 'CLOSED') {
      socket.emit('errorEvent', 'Chat is closed, you cannot send messages');
      return;
    }
    const databaseMessage = {
      messageText: rawMessage.messageText,
      isSystem: false,
      timestamp: new Date(),
      userID: socket.data.authorized_user.id
    } as IChatMessageDB;

    chat.messages.push(databaseMessage);
    await chat.save();

    // summarize the chat when no vet is assigned
    if (chat.participants.length === 1) {
      void addSummaryToChat(chat.id)
    }

    const message = {
      messageText: rawMessage.messageText,
      sendBy: socket.data.authorized_user.id
    } as IChatMessageFE;
    // send message to all users in the chat
    socket.to(rawMessage.chatID).emit('receiveMessage', {message: message});
  });

  socket.on('joinChat', async (chatID: string) => {
    const chat = await ChatModel.findById(chatID);
    if (!chat) {
      // this should never happen the client is doing something fishy or the database is corrupted
      socket.emit('errorEvent', 'Chat not found' );
      return;
    }
    if (!chat.participants.includes(socket.data.authorized_user.id)) {
      // the user is not part of the chat - this should never happen
      // return AxiosError
      socket.emit('errorEvent', 'User not part of the chat');
      return;
    }

    socket.join(chatID);
  });
};

export const sendSystemMessage = async (chatID: string, messageText: string) => {
  const chat = await ChatModel.findById(chatID);
  if (!chat) {
    console.error('Chat not found');
    return;
  }
  chat.messages.push({
    messageText: messageText,
    isSystem: true,
    timestamp: new Date()
  });
  await chat.save();
  const feChat = await chat.toIChatFEWithoutMessages();
  const message = {
    messageText: messageText,
    sendBy: SYSTEM_USER_ID
  } as IChatMessageFE;
  io.to(chatID).emit('receiveMessage', {
    message: message,
    chat: feChat
  });
}