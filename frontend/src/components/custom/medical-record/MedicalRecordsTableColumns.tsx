import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import { MedicalRecord } from "@/types/medicalRecords"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { LuArrowRight } from "react-icons/lu"

export const getColumns = (actionCallback: (id: string) => void) => {
  const columns: ColumnDef<MedicalRecord>[] = [
    {
      accessorKey: "id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Record Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "animalId",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("animalId")}</div>
      ),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Animal Id
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "farmerName",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("farmerName")}</div>
      ),
      header: "Farmer Name",
    },
    {
      accessorKey: "vetName",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("vetName")}</div>
      ),
      header: "Vet Name",
    },
    {
      accessorKey: "sex",
      header: "Sex",
      enableHiding: false,
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("sex")}</div>
      },
    },
    {
      accessorKey: "species",
      header: "Species",
      enableHiding: false,
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue("species")}</div>
      },
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const id: string = row.getValue("id")
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
