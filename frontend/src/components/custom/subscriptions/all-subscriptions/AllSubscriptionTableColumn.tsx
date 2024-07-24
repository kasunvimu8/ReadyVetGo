import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import { SubscribedCustomer } from "@/types/subscription"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { MdOpenInNew } from "react-icons/md"

export const getColumns = () => {
  const columns: ColumnDef<SubscribedCustomer>[] = [
    {
      accessorKey: "id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Subscription Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "planNickname",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("planNickname")}</div>
      ),
      header: "Plan",
    },
    {
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
      header: "Status",
    },
    {
      accessorKey: "currentPeriodStart",
      header: "Period Start",
      enableHiding: false,
      cell: ({ row }) => {
        const timeStamp = row.original.currentPeriodStart
        return (
          <div className="capitalize">
            {timeStamp ? formatDateTime(new Date(timeStamp * 1000)) : ""}
          </div>
        )
      },
    },

    {
      accessorKey: "currentPeriodEnd",
      cell: ({ row }) => {
        const timeStamp = row.original.currentPeriodEnd
        return (
          <div className="capitalize">
            {timeStamp ? formatDateTime(new Date(timeStamp * 1000)) : ""}
          </div>
        )
      },
      header: "Period End",
    },
    {
      accessorKey: "cancelAtPeriodEnd",
      header: "Canceled At Period End",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {row.getValue("cancelAtPeriodEnd") ? "Cancelled" : "Continuing"}
          </div>
        )
      },
    },
    {
      accessorKey: "receiptUrl",
      header: "Receipt URL",
      enableHiding: false,
      cell: ({ row }) => {
        const url: string = row.getValue("receiptUrl")
        return (
          <MdOpenInNew
            className="cursor-pointer w-5 h-5"
            onClick={() => {
              window.open(url, "_blank")
            }}
          />
        )
      },
    },
  ]
  return columns
}
