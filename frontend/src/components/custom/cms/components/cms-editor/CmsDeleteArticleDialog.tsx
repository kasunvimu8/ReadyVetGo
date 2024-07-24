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
import { Button } from "@/components/ui/button.tsx"
import { PropsWithChildren, useState } from "react"
import Loading from "@/components/shared/Loading.tsx"

interface CmsDeleteArticleDialogProps {
  onDeleteArticle: () => Promise<void>
}
export function CmsDeleteArticleDialog({
  onDeleteArticle,
  children,
}: PropsWithChildren<CmsDeleteArticleDialogProps>) {
  const [isDeleting, setIsDeleting] = useState(false)

  const getDeleteButtonContents = () => {
    return !isDeleting ? (
      "Delete"
    ) : (
      <>
        <Loading /> <span className="ml-2">Deleting</span>
      </>
    )
  }

  const onDeleteClick = async () => {
    try {
      setIsDeleting(true)
      await onDeleteArticle()
    } catch (err) {
      console.error(err)
    }
    setIsDeleting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this article?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button variant="destructive" onClick={onDeleteClick}>
            {getDeleteButtonContents()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
