import { Button } from "@/components/ui/button.tsx"
import { formatDateTime } from "@/lib/utils.ts"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"
import {
  CmsPageState,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { CmsStatePill } from "@/components/custom/cms/components/cms-editor/CmsStatePill.tsx"
import CmsApprovalDialog from "@/components/custom/cms/components/approve-blogpost/CmsApprovalDialog.tsx"

export const getColumns = (
  feedbackCallback: (
    cmsPost: CmsPost,
    newState: CmsPageState,
    feedback?: string
  ) => Promise<void>
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
            <CmsApprovalDialog
              cmsPost={row.original}
              onSubmitDialog={(newState, feedback) =>
                feedbackCallback(row.original, newState, feedback)
              }
            >
              <Button
                disabled={row.getValue("state") !== CmsPageState.InReview}
              >
                Review
              </Button>
            </CmsApprovalDialog>
          </div>
        )
      },
    },
  ]
  return columns
}
