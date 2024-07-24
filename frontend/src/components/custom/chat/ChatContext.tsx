import React from "react";
import { Chat } from "@/types/chat.ts";

/**
 * Type definition for chat context.
 * @interface ChatContextType
 */
interface ChatContextType {

  /**
   * Sends a chat message.
   * @param {string} message - The message to send.
   */
  sendMessage: (message: string) => void;

  /**
   * The chat with id messages and so on
   */
  CurrentChat?: Chat;
}

/**
 * Default value for ChatContext
 */
const defaultChatContext: ChatContextType = {
  sendMessage: () => {},
};

/**
 * Context for chat messages and sending messages.
 * @type {React.Context<ChatContextType>}
 * @example
 * const { messages, sendMessage } = useContext(ChatContext);
 */
export const ChatContext = React.createContext<ChatContextType>(defaultChatContext);