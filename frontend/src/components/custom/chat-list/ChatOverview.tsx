import PageTitle from "@/components/shared/PageTitle"
import ChatTable from "@/components/custom/chat-list/ChatTable.tsx"
import { getOngoingChats, getOpenChats } from "@/api/chat.ts";

const ChatOverview = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Chat Overview"/>
        </div>
      </div>
      <div className="mx-auto py-5">
        <ChatTable
          fetchChats={getOngoingChats}
          headline="Your Ongoing Chats:"
        />
      </div>
      <div className="mx-auto py-5">
        <ChatTable
          fetchChats={getOpenChats}
          headline="Open Chats:"
        />
      </div>
    </div>
  )
}

export default ChatOverview
