import "./socket"
import { emitEvent, onEvent } from "./socket"
import {
  Chat,
  ChatMessageReceived,
  ChatMessageSent,
  ChatSummary,
} from "@/types/chat.ts"
import { GET, POST } from "@/lib/http.ts"

/**
 * Sends a chat message to the server.
 *
 * @param {ChatMessageSent} message - The chat message to be sent.
 * @example
 * sendMessage({ messageText: "Hello", chatID: "room-1", messageType: MessageType.SENT });
 */
export const sendMessage = (message: ChatMessageSent): void => {
  emitEvent<ChatMessageSent>("sendMessage", message)
}

/**
 * Sets up a listener for receiving chat messages from the server.
 *
 * @param {(message: ChatMessageReceived) => void} callback - The callback function to handle the received message.
 * @example
 * receiveMessage((message, chat) => {
 *   console.log("Received message: ", message.messageText);
 *   if (chat) {
 *    // the chat was updated eg status or participants ...
 *    console.log("Chat updated: ", chat.status);
 *    console.log("Chat participants: ", chat.participants);
 *    // chat messages are not included in the chat object
 *    }
 * });
 */
export const receiveMessage = (
  callback: (response: ChatMessageReceived) => void
): void => {
  onEvent("receiveMessage", (response: ChatMessageReceived) => {
    callback(response)
  })
}

/**
 * Joins a chat room.
 * @param {string} chatID - The chat identifier.
 * @example
 * _joinChatRoom("room-1");
 */
const _joinChatRoom = (chatID: string): void => {
  emitEvent<string>("joinChat", chatID)
}

/**
 * Connects to a chat room.
 * @param {string} chatID - The chat identifier.
 * @example
 * chatMessages: ChatMessages[] = await connectToChat("room-1");
 */
export const connectToChat = async (chatID: string): Promise<Chat> => {
  _joinChatRoom(chatID)
  return await GET<Chat>(`/chat/${chatID}`)
}

/**
 * create a new chat.
 * @example
 * const chatId: string = await createNewChat();
 */
export const createNewChat = async (): Promise<string> => {
  return await GET<string>("/chat/new")
}

/**
 * close a chat. Closed chats can no longer be used to send and receive messages.
 */
export const closeChat = async (chatId: string): Promise<void> => {
  await POST<void, { chatId: string }>("/chat/close", { chatId: chatId })
}

/**
 * Get all open chats.
 */
export const getOpenChats = async (): Promise<Chat[]> => {
  return await GET<Chat[]>("/chat/open")
}

/**
 * Get all ongoing chats for the current user.
 */
export const getOngoingChats = async (): Promise<Chat[]> => {
  return await GET<Chat[]>("/chat/ongoing")
}

/**
 * Get assign the current user to a chat.
 * @param {string} chatId - The chat identifier.
 * @example
 * const chat: Chat = await assignCurrentUserToChat("5d8f91d0-22cf-4244-9b23-3a2c6a4ef713");
 */
export const assignCurrentUserToChat = async (
  chatId: string
): Promise<Chat> => {
  return await POST<Chat, { chatId: string }>("/chat/assign", {
    chatId: chatId,
  })
}

/**
 * Get all chats for the current user.
 */
export const getCurrentUserChats = async (): Promise<Chat[]> => {
  return await GET<Chat[]>("/chat")
}

/**
 * Get all chats for the farmer. Usage -> Load the summary for the veterinarian
 */
export const getConsultationSummary = async (
  farmerId: string
): Promise<ChatSummary[]> => {
  return await GET<ChatSummary[]>(`/chat/chat-summary/${farmerId}`)
}
