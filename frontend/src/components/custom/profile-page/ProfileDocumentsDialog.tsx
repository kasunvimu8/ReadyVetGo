import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loading from "@/components/shared/Loading"
import {
  getDocumentsOfUser,
  assignDocumentToCurrentUser,
  deleteDocument,
} from "@/api/profile"
import { uploadFile, deleteFile } from "@/api/file-upload"
import { User, UserDocument } from "@/types/user"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { closeSheet } from "@/types/sheetAction"
import { useNavigate } from "react-router-dom"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select.tsx";

const ProfileDocuments: React.FC<User> = (user) => {
  const [docCount, setDocCount] = useState<number | null>(null)
  const [docs, setDocs] = useState<UserDocument[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customDocTitle, setCustomDocTitle] = useState<string>("")
  const [selectedDocType, setSelectedDocType] =
    useState<string>("certification")

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    const loadDocNames = async () => {
      try {
        const userDocuments = await getDocumentsOfUser(user.id)
        setDocCount(userDocuments.length)
        setDocs(userDocuments)
      } catch (err) {
        console.log(err)
        setDocCount(0)
      }
    }

    void loadDocNames()
  }, [user.id])

  const getLink = (path: string) => {
    const backendUrl = import.meta.env.VITE_FILE_UPLOAD_URL as string
    return `${backendUrl}/${path}`
  }

  const onFileUpload = async () => {
    setLoading(true)
    const fileInput = document.getElementById("fileInput") as HTMLInputElement
    if (!fileInput.files) {
      setError("Please upload a document")
      return
    }
    const file = fileInput.files[0]
    try {
      const uploadResult = await uploadFile(file, false)
      if (uploadResult.status !== "success") {
        setError("Error uploading document, please try again")
        return
      }
      let docTitle = ""
      switch (selectedDocType) {
        case "certification":
          docTitle = "Certification"
          break
        case "cv":
          docTitle = "CV"
          break
        case "custom":
          if (customDocTitle === "") {
            setError("Please provide a title for the custom document")
            return
          }
          docTitle = customDocTitle
          break
        default:
          setError("Invalid document type selected")
          return
      }
      await assignDocumentToCurrentUser({
        path: uploadResult.fileUrl,
        title: docTitle,
      } as UserDocument)
      setError(null)
      // Reload documents
      const updatedDocs = await getDocumentsOfUser(user.id)
      setDocs(updatedDocs)
      setDocCount(updatedDocs.length)
      // Close the dialog
      dispatch(closeSheet())
      navigate("/profile")
    } catch (e) {
      console.error(e)
      setError("Error uploading document, please try again")
    }
    setLoading(false)
  }

  const handleDelete = async (filePath: string) => {
    try {
      await deleteDocument(filePath)
      await deleteFile(filePath)
      setDocs(docs.filter((doc) => doc.path !== filePath))
      setDocCount(docs.length - 1)
    } catch (err) {
      console.error("Error deleting document:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="m-4">
          {docCount} Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Documents</DialogTitle>
          <DialogDescription>
            Documents assigned to {user.email}
          </DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-gray-200">
          {docs.map((doc, index) => (
            <li key={index} className="flex justify-between items-center py-2">
              <span>{doc.title}</span>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(doc.path)}
                >
                  🗑️
                </Button>
                <a href={getLink(doc.path)}>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Label htmlFor="docType">Select Document Type</Label>
          <Select onValueChange={(value) => setSelectedDocType(value)} defaultValue={selectedDocType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="cv">CV</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedDocType === "custom" && (
          <div className="mt-4">
            <Label htmlFor="customDocTitle">Document Title</Label>
            <Input
              id="customDocTitle"
              value={customDocTitle}
              onChange={(e) => setCustomDocTitle(e.target.value)}
            />
          </div>
        )}
        <div className="mt-4">
          <Label htmlFor="fileInput">Upload Document</Label>
          <Input id="fileInput" type="file" />
        </div>
        <div className="text-red-500 text-center mt-2">{error}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
          <Button
            className="w-full"
            onClick={onFileUpload}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="absolute flex items-center right-14">
                <Loading />
              </div>
            )}
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDocuments
