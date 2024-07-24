import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatDateTime } from "@/lib/utils"
import { UserProfile } from "@/types/user"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import DocumentCard from "@/components/custom/verify-vet/DocumentCard.tsx"

export const getColumns = (
  actionCallback: (id: string, isVerified: boolean) => void
) => {
  const columns: ColumnDef<UserProfile>[] = [
    {
      accessorKey: "id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vet User Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      enableHiding: false,
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
      enableHiding: true,
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      enableHiding: true,
      cell: ({ row }) => {
        const created_at = row.getValue("createdDate")
        const date = formatDateTime(new Date(String(created_at)))
        return <div className="capitalize">{date}</div>
      },
    },
    {
      accessorKey: "docs",
      header: "Documents",
      enableHiding: true,
      cell: ({ row }) => {
        return <DocumentCard {...row.original} />
      },
    },
    {
      accessorKey: "isVerified",
      header: "Verify Status",
      enableHiding: false,
      cell: ({ row }) => {
        const isVerified: boolean = row.getValue("isVerified")
        const id: string = row.getValue("id")
        return (
          <Switch
            checked={isVerified}
            onCheckedChange={(isVerified) => {
              actionCallback(id, isVerified)
            }}
          />
        )
      },
    },
  ]
  return columns
}
