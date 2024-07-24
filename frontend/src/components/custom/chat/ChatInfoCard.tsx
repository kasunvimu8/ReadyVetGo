import { Chat } from "@/types/chat.ts"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import ProfileInfoCard from "@/components/custom/chat/ProfileInfoCard.tsx"

const ChatInfoCard = ({ chat }: { chat: Chat }) => {
  return (
    <Card>
      <CardHeader>
        <h2>
          {chat.chatSummaryTitle === "" ? "New Chat" : chat.chatSummaryTitle}
        </h2>
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-sm font-normal">Participants</div>
        {chat.participants.map((participant) => (
          <div key={participant.id} className="pl-2">
            <ProfileInfoCard {...participant} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ChatInfoCard
