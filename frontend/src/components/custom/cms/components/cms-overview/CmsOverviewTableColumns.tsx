import { Button } from "@/components/ui/button"
import {
  CaretSortIcon,
  MagnifyingGlassIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"
import { formatDateTime } from "@/lib/utils.ts"
import { Link } from "react-router-dom"
import { BsFillGearFill } from "react-icons/bs"
import CmsSettingsDialog from "@/components/custom/cms/components/cms-editor/CmsSettingsDialog.tsx"
import { CmsStatePill } from "@/components/custom/cms/components/cms-editor/CmsStatePill.tsx"

export const getColumns = (
  settingsCallback: (updatedPost: Partial<CmsPost>) => Promise<void>
) => {
  const columns: ColumnDef<CmsPost>[] = [
    {
      accessorKey: "title",
      enableHiding: false,
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="[transform:translateX(-1rem)]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CMS Post Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "relativeUrl",
      cell: ({ row }) => (
        <div className="font-mono">
          {window.location.origin}/blog/{row.getValue("relativeUrl")}
        </div>
      ),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="[transform:translateX(-1rem)]"
          >
            CMS Post URL
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "createdBy",
      cell: ({ row }) => {
        const createdBy = row.original.createdBy
        return (
          <div>
            {createdBy.firstName} {createdBy.lastName}
          </div>
        )
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="[transform:translateX(-1rem)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created By
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "state",
      cell: ({ row }) => (
        <div>
          <CmsStatePill state={row.getValue("state")} />
        </div>
      ),
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="[transform:translateX(-1rem)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "lastEditedDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="[transform:translateX(-1rem)]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Edited Date
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableHiding: true,
      cell: ({ row }) => {
        const created_at = row.getValue("lastEditedDate")
        const date = formatDateTime(new Date(String(created_at)))
        return <div className="capitalize">{date}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-4 width[fit-content]">
            <Link to={`/blog/${row.original.relativeUrl}`}>
              <Button variant="outline">
                <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
            <CmsSettingsDialog
              cmsPost={row.original}
              isCreatingPost={false}
              onSubmitDialog={settingsCallback}
              isUserInEditor={false}
            >
              <Button>
                <BsFillGearFill className="h-4 w-4" />
              </Button>
            </CmsSettingsDialog>
            <Link to={`/cms-editor/${row.original.id}`}>
              <Button>
                <Pencil2Icon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]
  return columns
}
