import { closeChat } from "@/api/chat.ts"
import { useContext, useState } from "react"
import { ChatContext } from "@/components/custom/chat/ChatContext.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import Loading from "@/components/shared/Loading.tsx"

/*shown before a vet closes the Chat*/
function CloseChat() {
  const navigate = useNavigate()

  const { CurrentChat } = useContext(ChatContext)

  const [loading, setLoading] = useState(false)

  const handleCloseChat = async () => {
    setLoading(true)
    if (!CurrentChat) return
    closeChat(CurrentChat.id)
      .then(() => {
        navigate(`/medical-records/create/${CurrentChat.id}`)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-2">Close Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close Chat</DialogTitle>
          <DialogDescription>
            This will close the chat. No more messaging is possible. After
            closing, you will be asked to fill out the medical report.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCloseChat} disabled={loading}>
            Close Chat {loading && <Loading />}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CloseChat
