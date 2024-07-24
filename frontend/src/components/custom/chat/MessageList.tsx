import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import Message from "@/components/custom/chat/Message";
import { ChatMessage } from "@/types/chat.ts";

const MessageList = () => {
  const {CurrentChat} = useContext(ChatContext);

  if (!CurrentChat || !CurrentChat.chatMessages) {
    console.error('Chat or chat messages not found');
    return null;
  }

  return (
    <div className="message-list">
      {CurrentChat.chatMessages.map((message: ChatMessage, index: number) => (
        <Message key={index} messageText={message.messageText} sendBy={message.sendBy}/>
      ))}
    </div>
  );
};

export default MessageList;