import { Button } from "@/components/ui/button"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { FaCircle } from "react-icons/fa"
import { LuArrowRight } from "react-icons/lu"
import Loading from "@/components/shared/Loading"
import { Chat, ChatParticipant, ChatStatus } from "@/types/chat.ts";
import { cn, dateToTimeDeltaString } from "@/lib/utils.ts";

export const getColumns = (actionCallback: (id: string) => void, is_loading: boolean) => {

  const columns: ColumnDef<Chat>[] = [
    {
      accessorKey: "createdDate",
      enableHiding: true,

      cell: ({row}) => {
        const createdDate =  new Date(row.getValue("createdDate"))
        console.log(createdDate)
        // type of the createdDate
        console.log(typeof createdDate)
        if (!createdDate) {
          return <div>...</div>
        }
        return (
          <div>{dateToTimeDeltaString(createdDate)}</div>
        )
      },
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Started
            <CaretSortIcon className="ml-2 h-4 w-4"/>
          </Button>
        )
      }
    },
    {
      accessorKey: "chatSummaryTitle",
      header: "Topic",
      cell: ({row}) => {
        const chatTitle = row.getValue("chatSummaryTitle") as string | undefined;
        return (
          <div>{chatTitle || "new"}</div>
        )
      },
    },
    {
      accessorKey: "participants",
      cell: ({row}) => <div>
        {(row.getValue("participants") as ChatParticipant[])
          .map((participant) => participant.name)
          .join(", ")}
      </div>,
      header: ({column}) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Name
            <CaretSortIcon className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      enableHiding: true,
    },
    {
      accessorKey: "chatStatus",
      header: "Status",
      enableHiding: false,
      cell: ({row}) => {
        const chatStatus: string = row.getValue("chatStatus")
        const colorClass = cn(
          {
            "text-green-600":
              chatStatus === ChatStatus.OPEN,
            "text-orange-600":
              chatStatus === ChatStatus.ONGOING,
            "text-red-600":
              chatStatus === ChatStatus.CLOSED,
          }
        )

        return (
          <div className="flex items-center space-x-2">
            <FaCircle className={colorClass}/>
            <span className="capitalize">{chatStatus}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "id",
      header: "chatID",
      enableHiding: true,
      cell: ({row}) => {
        const id: string = row.getValue("id")
        return (
          <div>{id}</div>
        )
      },
    },
    {
      accessorKey: "action",
      header: "Actions",
      enableHiding: true,
      cell: ({row}) => {
        const id: string = row.getValue("id")
        if (is_loading) {
          return <Loading/>
        }
        return (
          <LuArrowRight
            className="cursor-pointer"
            onClick={() => actionCallback(id)}
          />
        )
      },
    },
  ]
  return columns
}
