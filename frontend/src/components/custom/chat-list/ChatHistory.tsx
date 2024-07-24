import PageTitle from "@/components/shared/PageTitle"
import ChatTable from "@/components/custom/chat-list/ChatTable.tsx"
import { getCurrentUserChats} from "@/api/chat.ts";

const ChatHistory = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Chat History"/>
        </div>
      </div>
      <div className="mx-auto py-5">
        <ChatTable
          fetchChats={getCurrentUserChats}
          headline="Your Chats:"
        />
      </div>
    </div>
  )
}

export default ChatHistory
