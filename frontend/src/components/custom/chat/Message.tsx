import React from "react"
import { cn } from "@/lib/utils.ts"
import { ChatMessage, SYSTEM_USER_ID } from "@/types/chat.ts"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store.ts"

const Message: React.FC<ChatMessage> = ({ messageText, sendBy }) => {
  const { user } = useSelector((state: RootState) => state.authentication)

  // style for messages
  const messageClass = cn(
    sendBy === SYSTEM_USER_ID
      ? "text-center w-full p-3 font-semibold italic"
      : "p-3 rounded-lg mb-2 max-w-md w-4/5 ",
    {
      "bg-primary text-white ml-auto rounded-br-none": sendBy === user?.id,
      "bg-secondary mr-auto text-primary rounded-bl-none":
        sendBy !== user?.id && sendBy !== SYSTEM_USER_ID,
    }
  )

  return (
    <div className={messageClass}>
      <p className="text-sm">{messageText}</p>
    </div>
  )
}

export default Message
