import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"
import { Input } from "@/components/ui/input.tsx"
import { ChangeEvent, createRef } from "react"
import { deleteFile, uploadFile } from "@/api/file-upload.ts"
import { AxiosError } from "axios"
import { Button } from "@/components/ui/button.tsx"
import { BsFillQuestionCircleFill, BsTrashFill } from "react-icons/bs"
import { Label } from "@/components/ui/label.tsx"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx"

const fileUploadUrl: string = import.meta.env.VITE_FILE_UPLOAD_URL

type CmsImageType = {
  uploadedFile?: File
  fileUrl?: string
  altText: string
  currentlyUploadedUrl?: string
}
const cmsImageDefaultContent: CmsImageType = {
  uploadedFile: undefined,
  altText: "",
}

function CmsImageDisplay({ content }: CmsDisplayProps<CmsImageType>) {
  if (content.fileUrl) {
    return (
      <div className="flex justify-center">
        <img
          className="rounded-xl shadow-sm"
          alt={content.altText}
          src={content.fileUrl}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center text-4xl w-full h-[400px] bg-gray-100 justify-center rounded-xl shadow-sm">
      No image available
    </div>
  )
}

function CmsImageEditor({
  content,
  onContentChange,
}: CmsEditProps<CmsImageType>) {
  const fileInputRef = createRef<HTMLInputElement>()

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onContentChange({
        ...content,
        uploadedFile: event.target.files[0],
        fileUrl: URL.createObjectURL(event.target.files[0]),
      })
    }
  }

  const onFileRemove = () => {
    onContentChange({
      ...content,
      fileUrl: undefined,
      uploadedFile: undefined,
    })
    if (fileInputRef.current) {
      fileInputRef.current.files = null
      fileInputRef.current.value = ""
    }
  }

  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          {content.fileUrl && (
            <div className="flex flex-col items-center justify-center relative">
              <img
                className="max-w-[250px] max-h-[300px]  rounded-xl shadow-sm"
                alt={content.altText}
                src={content.fileUrl}
              />

              <Button
                className="m-2 text-destructive hover:text-destructive hover:bg-red-100"
                variant="ghost"
                onClick={onFileRemove}
              >
                <BsTrashFill />
                Remove image
              </Button>
            </div>
          )}

          <Label htmlFor="image">
            {content.fileUrl ? "Replace Image:" : "Add Image"}
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/png, image/gif, image/jpeg"
            name="image"
            ref={fileInputRef}
            onChange={(event) => onFileUpload(event)}
          ></Input>

          <Label htmlFor="alt-text" className="pt-2 flex">
            <span className="mr-1">Short Image Description</span>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger onClick={(e) => e.preventDefault()}>
                  <BsFillQuestionCircleFill />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-center">
                    This text is being used for
                    <br /> accessibility purposes
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>

          <Input
            id="alt-text"
            value={content.altText}
            onChange={(e) =>
              onContentChange({
                ...content,
                altText: e.target.value,
              })
            }
            placeholder="Short image description"
          />
        </div>
      </div>
    </form>
  )
}

const CmsImageContainer: CmsContainerInterface<CmsImageType> = {
  Display: CmsImageDisplay,
  Editor: CmsImageEditor,
  defaultContent: cmsImageDefaultContent,
  onSaveMap: async (content) => {
    if (
      content.currentlyUploadedUrl &&
      content.currentlyUploadedUrl !== content.fileUrl
    ) {
      // Url has changed (fileUrl is now probably a blob, that has been uploaded by the user)
      // We need to delete the previousFile
      await deleteFile(content.currentlyUploadedUrl.slice(fileUploadUrl.length))
        .catch((err) => {
          if (err instanceof AxiosError && err.response?.status !== 404) {
            // It's another error than "File to delete was not found":
            // We pass it on so that we stop saving the whole CMS post
            throw err
          }
        })
        .then(() => (content.currentlyUploadedUrl = undefined))
    }

    if (content.uploadedFile) {
      await uploadFile(content.uploadedFile, true)
        .then((response) => {
          content.uploadedFile = undefined
          content.fileUrl = `${fileUploadUrl}/${response.fileUrl}`
          // We store it also as currentlyUploadedUrl so that in case there is an error next time, we can fall back on this one
          content.currentlyUploadedUrl = content.fileUrl
        })
        .catch((err: Error) => {
          content.fileUrl = content.currentlyUploadedUrl
          // Pass it on so that we stop saving the whole CMS post
          throw err
        })
    }

    return content
  },
  onDeleteEvent: async (content) => {
    if (content.currentlyUploadedUrl) {
      await deleteFile(content.currentlyUploadedUrl.slice(fileUploadUrl.length))
        .catch((err) => {
          if (err instanceof AxiosError && err.response?.status !== 404) {
            // It's another error than "File to delete was not found":
            // We pass it on so that we stop saving the whole CMS post
            throw err
          }
        })
        .then(() => (content.currentlyUploadedUrl = undefined))
    }
  },
}

export { CmsImageContainer }
