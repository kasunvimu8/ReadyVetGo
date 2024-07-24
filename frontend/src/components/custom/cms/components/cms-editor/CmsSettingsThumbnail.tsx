import {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  ReactCrop,
} from "react-image-crop"
import { FormItem, FormLabel } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
  ChangeEvent,
  forwardRef,
  MouseEvent,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { deleteFile, uploadFile } from "@/api/file-upload.ts"
import { toast } from "@/components/ui/use-toast.ts"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"


const fileUploadUrl: string = import.meta.env.VITE_FILE_UPLOAD_URL

interface CmsSettingsThumbnailProps {
  existingThumbnailUrl?: string
}
export type CmsSettingsThumbnailHandle = {
  uploadThumbnail: () => Promise<string | null>
}

const CmsSettingsThumbnail = forwardRef<
  CmsSettingsThumbnailHandle,
  CmsSettingsThumbnailProps
>(({ existingThumbnailUrl }: CmsSettingsThumbnailProps, ref) => {
  const [thumbnailCrop, setThumbnailThumbnailCrop] = useState<Crop>()
  const [cropImgSrc, setCropImgSrc] = useState("")
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const thumbnailAspectRatio = 16 / 9

  // Canvas Code Inspired by https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o
  const generateCroppedImage = async (): Promise<File | null> => {
    const image = imgRef.current
    if (!image || !thumbnailCrop) {
      console.log("Crop canvas does not exist")
      return null
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const completedCrop = convertToPixelCrop(
      thumbnailCrop,
      image.width,
      image.height
    )

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    )
    const ctx = offscreen.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    ctx.fillStyle = "white"
    const pixelRatio = window.devicePixelRatio

    offscreen.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
    offscreen.height = Math.floor(completedCrop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY

    ctx.save()
    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    )

    ctx.restore()

    const fileBlob = await offscreen.convertToBlob({
      type: "image/jpeg",
      quality: 0.7,
    })

    return new File([fileBlob], "thumbnail.jpg", { type: "image/jpeg" })
  }

  useImperativeHandle(ref, () => ({
    uploadThumbnail: async () => {
      const thumbnailToUpload = await generateCroppedImage()
      if (!thumbnailToUpload) {
        return null
      }

      try {
        if (existingThumbnailUrl) {
          await deleteFile(existingThumbnailUrl)
        }
        
        const response = await uploadFile(thumbnailToUpload, true)
        return response.fileUrl
      } catch (err) {
        toast({
          title: "Thumbnail Upload Failed",
          description: "Please try again later",
          variant: "destructive",
        })

        return null
      }
    },
  }))

  const onThumbnailImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setThumbnailThumbnailCrop(
      centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 100,
          },
          thumbnailAspectRatio,
          width,
          height
        ),
        width,
        height
      )
    )
  }

  const onSelectThumbnailImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener("load", () =>
        setCropImgSrc(reader.result?.toString() || "")
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleThumbnailImageClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    hiddenFileInput.current?.click()
  }

  const onRevertUpload = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setCropImgSrc("")
    setThumbnailThumbnailCrop(undefined)
  }

  return (
    <>
      <FormItem>
        <FormLabel>Article Thumbnail</FormLabel>
        {!cropImgSrc && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={
                existingThumbnailUrl
                  ? `${fileUploadUrl}/${existingThumbnailUrl}`
                  : "/no-image.jpg"
              }
              className="w-full"
              alt="article-thumbnail"
            />
            <div className="absolute top-0 left-0 duration-500 opacity-0 hover:bg-black/50 hover:opacity-100 w-full h-full">
              <Button
                variant="outline"
                className="absolute bg-transparent text-white right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2"
                onClick={handleThumbnailImageClick}
              >
                {existingThumbnailUrl ? "Replace Thumbnail" : "Add Thumbnail"}
              </Button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            className={cn({ hidden: !cropImgSrc })}
            type="file"
            placeholder="Article thumbnail"
            accept="image/*"
            onChange={onSelectThumbnailImg}
            ref={hiddenFileInput}
          />
          {!!existingThumbnailUrl && !!cropImgSrc && (
            <Button variant="destructive" onClick={onRevertUpload}>
              Revert
            </Button>
          )}
        </div>
      </FormItem>

      {!!cropImgSrc && (
        <div className="flex justify-center">
          <ReactCrop
            className="w-fit rounded-xl overflow-hidden"
            crop={thumbnailCrop}
            onChange={(c) => setThumbnailThumbnailCrop(c)}
            aspect={thumbnailAspectRatio}
            keepSelection={true}
          >
            <img
              src={cropImgSrc}
              alt="Cropped image"
              onLoad={onThumbnailImgLoad}
              ref={imgRef}
            />
          </ReactCrop>
        </div>
      )}
    </>
  )
})

export default CmsSettingsThumbnail
