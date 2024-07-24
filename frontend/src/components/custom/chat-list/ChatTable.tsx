import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import Loading from "@/components/shared/Loading"
import { getColumns } from "@/components/custom/chat-list/ChatTableColumns.tsx"
import { Chat } from "@/types/chat.ts";
import { assignCurrentUserToChat } from "@/api/chat.ts";
import { useNavigate } from "react-router-dom";

const visibility = {
  action: true,
  userName: true,
  status: true,
  id: false,
  createdDate: true,
  chatSummaryTitle: true,
}

interface ChatOverviewTableProps {
  fetchChats: () => Promise<Chat[]>;
  headline: string;
}

const ChatTable = ({ fetchChats, headline }: ChatOverviewTableProps) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [assignmentLoading, setAssignmentLoading] = useState<boolean>(false)

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true)
      fetchChats().then((fetchedChats) => {
        setChats(fetchedChats)
      }).catch((error) => {
        console.error("Error fetching chats:", error);
      }).finally(() => {
        setLoading(false)
      })
    })()
  }, [fetchChats])

  const openChat = async (chat: Chat) => {
    setAssignmentLoading(true);
    try {
      if (chat.chatStatus === "OPEN") {
        await assignCurrentUserToChat(chat.id);
      }
      navigate(`/chat/${chat.id}`);
    } catch (error) {
      console.error("Error assigning user to chat:", error);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleOnclick = (id: string) => {
    const chat = chats.find((chat) => chat.id === id)
    if (!chat) return // this should never happen
    void openChat(chat)
  }

  if (loading) return <Loading />
  return (
    <div>
      <h2>{headline}</h2>
      <DataTable
        columns={getColumns(handleOnclick, assignmentLoading)}
        data={chats}
        visibility={visibility}
        filterId="createdDate"
        filterDescription="Filter by username"
      />
    </div>
  )
}

export default ChatTable
