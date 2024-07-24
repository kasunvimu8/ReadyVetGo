import { FC } from "react"
import Loading from "@/components/shared/Loading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { VetWithDocs } from "@/components/custom/verify-vet/VerifyVetTable.tsx"
import { createPortal } from "react-dom"

const DocumentCard: FC<VetWithDocs> = (user) => {
  const getLink = (path: string) => {
    const backendUrl = import.meta.env.VITE_FILE_UPLOAD_URL as string
    return `${backendUrl}/${path}`
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Documents</DialogTitle>
        <DialogDescription>
          Documents assigned to {user.email}
        </DialogDescription>
      </DialogHeader>
      <ul className="divide-y divide-gray-200">
        {user?.documents &&
          user.documents.map((doc, index) => (
            <li key={index} className="flex justify-between items-center py-2">
              <span>{doc.title}</span>
              <a href={getLink(doc.path)}>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </a>
            </li>
          ))}
      </ul>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button type="button">Close</Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  )

  return (
    (user.documents?.length == null && <Loading />) || (
      <div className="flex flex-col items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {user.documents?.length} Documents
            </Button>
          </DialogTrigger>
          {/*using ReactDOM.createPortal to render the dialog content outside the parent component*/}
          {createPortal(dialogContent, document.body)}
        </Dialog>
      </div>
    )
  )
}

export default DocumentCard
