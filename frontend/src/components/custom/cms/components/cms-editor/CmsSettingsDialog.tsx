import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react"
import useDebouncedValue from "@/hooks/useDebouncedValue.ts"
import Loading from "@/components/shared/Loading.tsx"
import { deleteCmsPage, getIsCmsPageAvailable } from "@/api/cms.ts"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/use-toast.ts"
import "react-image-crop/dist/ReactCrop.css"
import CmsSettingsThumbnail, {
  CmsSettingsThumbnailHandle,
} from "@/components/custom/cms/components/cms-editor/CmsSettingsThumbnail.tsx"
import { CmsDeleteArticleDialog } from "@/components/custom/cms/components/cms-editor/CmsDeleteArticleDialog.tsx"
import { componentsMap } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import { deleteFile } from "@/api/file-upload.ts"

const FormSchema = z.object({
  articleTitle: z.string().min(5),
  articleUrl: z
    .string()
    .min(5)
    .regex(
      /^[a-z|0-9-]+$/,
      "URLs may only contain letters without special characters, numbers and '-'"
    ),
})

interface CmsSettingsDialogProps {
  cmsPost: Partial<CmsPost>
  /// true if the CMS Page does not exist yet
  isCreatingPost: boolean
  /// Returning a partial, due to the case it is a new post where the CmsPost won't yet contain all the attributes
  onSubmitDialog: (updatedPost: Partial<CmsPost>) => Promise<void>
  isUserInEditor: boolean
}
export default function CmsSettingsDialog({
  children,
  cmsPost,
  isCreatingPost,
  onSubmitDialog,
  isUserInEditor,
}: PropsWithChildren<CmsSettingsDialogProps>) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      articleTitle: "",
      articleUrl: "",
    },
    mode: "onChange",
  })

  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentURL, setCurrentURL] = useState("")
  const [isLoadingUrlAvailability, setIsLoadingUrlAvailability] =
    useState(false)
  const [lastValidUrl, setLastValidUrl] = useState("")
  const thumbnailUploadRef = useRef<CmsSettingsThumbnailHandle>(null)

  // Debounce hook to only retrieve the updatedUrl after 500ms of no changes, to avoid doing API calls at every input change
  const debouncedArticleUrl = useDebouncedValue(currentURL, 500)

  // Triggers to act on changes of the debounced ArticleUrl
  useEffect(() => {
    if (debouncedArticleUrl.trim().length === 0) return

    if (
      cmsPost.relativeUrl?.trim() !== "" &&
      debouncedArticleUrl === cmsPost.relativeUrl
    ) {
      // Url is the one that this article currently has, obviously this one is valid
      setIsLoadingUrlAvailability(false)
      setLastValidUrl(debouncedArticleUrl)
      return
    }

    getIsCmsPageAvailable(debouncedArticleUrl).then((isAvailable) => {
      setIsLoadingUrlAvailability(false)
      if (isAvailable) {
        setLastValidUrl(debouncedArticleUrl)
      } else {
        form.control.setError("articleUrl", {
          type: "custom",
          message: "This URL is already taken",
        })
      }
    })
  }, [cmsPost.relativeUrl, debouncedArticleUrl, form.control])

  useEffect(() => {
    // Opens up the dialog immediately in case there is no id in the editor / the id === "new"
    if (isCreatingPost) {
      setDialogOpen(true)
    }
  }, [isCreatingPost])

  // Runs whenever the dialogs opens / closes and whenever the cmsPost / isCreatingPost props change
  // Warning, as this component gets called inside CmsEditor and passes the cmsProps from there, this
  // is already run once after initialising the CMS Editor
  useEffect(() => {
    form.reset({
      articleTitle: cmsPost.title ?? "",
      articleUrl: cmsPost.relativeUrl ?? "",
    })

    if (cmsPost.relativeUrl && cmsPost.relativeUrl?.trim() !== "") {
      setLastValidUrl(cmsPost.relativeUrl)
    }
  }, [cmsPost, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    cmsPost.title = data.articleTitle
    cmsPost.relativeUrl = data.articleUrl

    setIsSubmitting(true)

    if (thumbnailUploadRef.current) {
      const imageUrl = await thumbnailUploadRef.current.uploadThumbnail()

      if (imageUrl) {
        cmsPost.thumbnailUrl = imageUrl
      }
    }

    onSubmitDialog(cmsPost)
      .then(() => {
        setIsSubmitting(false)
        setDialogOpen(false)
        toast({
          title: "✅ Success!",
          description: `Successfully ${isCreatingPost ? "created post" : "saved settings"}`,
        })
      })
      .catch(() => setIsSubmitting(false))
  }

  function onUrlChange(event: FormEvent<HTMLInputElement>) {
    let updatedURL = event.currentTarget.value
    updatedURL = updatedURL.toLowerCase().replace(/\s/, "-")

    form.setValue("articleUrl", updatedURL, {
      shouldValidate: true,
    })

    // Running this asynchronously, to allow ZODs validation code to run first
    setTimeout(() => {
      if (!form.getFieldState("articleUrl").invalid) {
        // Only trigger the debounced URL whenever the articleURL is actually valid
        setCurrentURL(updatedURL)
        // Already set isLoadingUrlAvailability to true to show the loading indicator
        // as we still have to wait for the debounce time to finish before sending a request
        // (except if the updatedUrl is the same as the debouncedArticleUrl, then we already have received an answer before),
        setIsLoadingUrlAvailability(updatedURL !== debouncedArticleUrl)

        if (
          updatedURL === debouncedArticleUrl &&
          debouncedArticleUrl !== lastValidUrl
        ) {
          // The last valid URL wasn't the one that has been debounced: re-show an error
          form.setError("articleUrl", {
            type: "custom",
            message: "This URL is already taken",
          })
        }
      }
    }, 0)
  }

  function onDialogChange(value: boolean): void {
    if (!value && isCreatingPost) {
      return
    }
    setDialogOpen(value)
  }

  function onCancel(): void {
    if (!isCreatingPost) {
      return
    }
    // Go back
    navigate(-1)
  }

  const getSubmitButtonContents = () => {
    if (isSubmitting) {
      return (
        <>
          <Loading />{" "}
          <span className="ml-2">
            {isCreatingPost ? "Creating post" : "Saving"}
          </span>
        </>
      )
    }
    return isCreatingPost ? "Create post" : "Save settings"
  }

  const onDeleteArticle = async () => {
    if (!cmsPost.id) {
      return
    }

    const deletePromises = []

    // Delete all the article's components
    const components = cmsPost?.cmsComponents ?? []
    for (const component of components) {
      const onDeleteEvent = componentsMap[component.type]?.onDeleteEvent

      if (onDeleteEvent) {
        deletePromises.push(onDeleteEvent(component.content))
      }
    }

    // Run the deletion tasks (such as deleting images that have been previously uploaded, etc.)
    await Promise.all(deletePromises)

    // Delete the thumbnailURL (we do this here and not in the BE as when doing it in localhost, we would like to access the dev BE)
    if (cmsPost.thumbnailUrl) {
      await deleteFile(cmsPost.thumbnailUrl)
    }

    // Finally delete the article itself
    await deleteCmsPage(cmsPost.id)

    setDialogOpen(false)

    if (isUserInEditor) {
      // Go back
      navigate(-1)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto"
        hasCloseButton={!isCreatingPost}
      >
        <Form {...form}>
          <form className="contents" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isCreatingPost ? "Create Blog Post" : "Blog Post Settings"}
              </DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="articleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CmsSettingsThumbnail
              ref={thumbnailUploadRef}
              existingThumbnailUrl={cmsPost.thumbnailUrl}
            />

            <FormField
              control={form.control}
              name="articleUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article URL</FormLabel>
                  <FormDescription>
                    Your post will be available under {window.location.origin}
                    /blog/
                    {form.getValues("articleUrl")}
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Article URL"
                      prefix="artic"
                      {...field}
                      onChange={onUrlChange}
                    />
                  </FormControl>
                  {isLoadingUrlAvailability && (
                    <div className="text-[0.8rem] text-muted-foreground flex gap-2">
                      <Loading /> Checking availability of URL
                    </div>
                  )}
                  {form.getValues("articleUrl") === lastValidUrl &&
                    lastValidUrl.trim() !== "" &&
                    !form.control.getFieldState("articleUrl").invalid && (
                      <p className="text-[0.8rem] text-green-600 flex gap-2">
                        URL is available
                      </p>
                    )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex justify-between w-full">
                <div>
                  {!isCreatingPost && (
                    <CmsDeleteArticleDialog onDeleteArticle={onDeleteArticle}>
                      <Button variant="destructive">Delete article</Button>
                    </CmsDeleteArticleDialog>
                  )}
                </div>

                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={
                      !form.formState.isValid ||
                      form.getValues("articleUrl") !== lastValidUrl
                    }
                  >
                    {getSubmitButtonContents()}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
