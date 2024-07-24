import { useEffect, useRef, useState } from "react"
import MessageList from "@/components/custom/chat/MessageList"
import InputBox from "@/components/custom/chat/InputBox"
import {
  connectToChat,
  getConsultationSummary,
  receiveMessage,
  sendMessage,
} from "@/api/chat"
import { ChatContext } from "./ChatContext"
import {
  ChatMessageReceived,
  ChatMessageSent,
  ChatSummary,
} from "@/types/chat.ts"
import { offEvent } from "@/api/socket"
import { Badge } from "@/components/ui/badge.tsx"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useParams } from "react-router-dom"
import AiAnswerSuggestion from "@/components/custom/chat/AiAnswerSugesstions.tsx"
import { Role } from "@/types/user.ts"
import CloseChat from "@/components/custom/chat/CloseChatDialog.tsx"
import { Chat } from "@/types/chat"
import Loading from "@/components/shared/Loading.tsx"
import ChatInfoCard from "@/components/custom/chat/ChatInfoCard.tsx"
import ConsulationSummary from "./ConsulationSummary"

const ChatPage = () => {
  const { chatID: initialChatID } = useParams<{ chatID?: string }>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [chatID] = useState<string>(initialChatID || "")
  const [chat, setChat] = useState<Chat | null>(null)
  const [summaryList, setSummaryList] = useState<ChatSummary[]>([])

  const { user } = useSelector((state: RootState) => state.authentication)

  // Receive messages from the server
  useEffect(() => {
    const messageHandler = (receivedChatMessage: ChatMessageReceived) => {
      setChat((prevChat) => {
        if (!prevChat || !prevChat.chatMessages) {
          console.error("Chat or chat messages not found")
          return prevChat
        }
        if (receivedChatMessage.chat) {
          // update the entire chat object but keep the old messages
          receivedChatMessage.chat.chatMessages = [
            ...prevChat.chatMessages,
            receivedChatMessage.message,
          ]
          return receivedChatMessage.chat
        } else {
          // only update the messages
          return {
            ...prevChat,
            chatMessages: [
              ...prevChat.chatMessages,
              receivedChatMessage.message,
            ],
          }
        }
      })
    }

    receiveMessage(messageHandler)
    return () => {
      offEvent("receiveMessage")
    }
  }, [])

  // Scroll to the bottom of the message list when a new message is added
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Extract chatMessages for useEffect dependency
  const chatMessages = chat?.chatMessages

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // Send a message to the server and add it to the message list
  const handleSendMessage = (messageText: string) => {
    const message: ChatMessageSent = {
      messageText,
      chatID: chatID,
      sendBy: user?.id || "",
    }
    try {
      sendMessage(message)
      setChat((prevChat) => {
        if (!prevChat || !prevChat.chatMessages) {
          console.error("Chat or chat messages not found")
          return prevChat
        }
        return {
          ...prevChat,
          chatMessages: [...prevChat.chatMessages, message],
        }
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const joinChat = async () => {
    setChat(await connectToChat(chatID))
    console.log("Chat joined")
  }

  const isOnline = useSelector(
    (state: RootState) => state.onlineStatus.isOnline
  )

  // on change from offline to online run handleJoinChat to get the new chat messages
  useEffect(() => {
    if (isOnline) {
      void joinChat()
    }
  }, [isOnline])

  useEffect(() => {
    ;(async () => {
      if (user?.id) {
        const consulationSummary = await getConsultationSummary(user?.id)
        setSummaryList(consulationSummary)
      }
    })()
  }, [user?.id])

  return (
    <ChatContext.Provider
      value={{ sendMessage: handleSendMessage, CurrentChat: chat || undefined }}
    >
      <div className="flex flex-grow h-full">
        <div className="w-1/3 p-4 bg-secondary">
          <div className="p-2 flex justify-between">
            <Badge
              className={
                isOnline
                  ? "bg-green-500 hover:bg-green-500"
                  : "bg-red-500 hover:bg-red-500 "
              }
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <ConsulationSummary summaryList={summaryList} />
          </div>
          {chat && <ChatInfoCard chat={chat} />}
          {user && user.role === Role.Vet && <CloseChat />}
        </div>
        <div className="w-2/3">
          <div className="overflow-y-auto h-full p-4 pb-16">
            {chat ? <MessageList /> : <Loading />}
            {user && user.role === Role.Vet && (
              <AiAnswerSuggestion onSuggestion={() => scrollToBottom()} />
            )}
            <div ref={bottomRef} />
          </div>
          <div className="bottom-0 fixed w-2/3 p-2 bg-background">
            <InputBox />
          </div>
        </div>
      </div>
    </ChatContext.Provider>
  )
}

export default ChatPage
