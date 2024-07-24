import { ChatSummary } from "@/types/chat"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LuBookOpen } from "react-icons/lu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

const ConsulationSummary = ({
  summaryList,
}: {
  summaryList: ChatSummary[]
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-white">
          Previous Consultations <LuBookOpen className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" hasCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Consultation Summary</DialogTitle>
          <DialogDescription>
            Records of the previous consultation summaries for the farmer
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="flex flex-col gap-2 p-4 max-h-[60vh]">
            {summaryList.map((summary) => (
              <div
                key={summary.chatSummaryTitle} // Assuming chatSummaryTitle is unique
                className="flex w-full flex-col gap-1 p-2 bg-white rounded shadow hover:bg-[#f4f4f5]"
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {summary.chatSummaryTitle}
                    </div>
                  </div>
                  <div className={cn("ml-auto text-xs text-muted-foreground")}>
                    {summary.createdDate &&
                      formatDistanceToNow(new Date(summary.createdDate), {
                        addSuffix: true,
                      })}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.chatSummaryText}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ConsulationSummary
