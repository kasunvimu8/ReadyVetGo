import { Button, buttonVariants } from "@/components/ui/button.tsx"
import { useEffect, useState } from "react"
import CmsEditorColumn from "@/components/custom/cms/components/cms-editor/CmsEditorColumn.tsx"
import CmsPreviewColumn from "@/components/custom/cms/components/cms-editor/CmsPreviewColumn.tsx"
import CmsComponentRef from "@/components/custom/cms/models/cms-component-ref.interface.ts"
import CmsSettingsDialog from "@/components/custom/cms/components/cms-editor/CmsSettingsDialog.tsx"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "@/components/shared/Loading.tsx"
import {
  CmsPageState,
  CmsPageType,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { createCmsPage, getCmsPageById, updateCmsPage } from "@/api/cms.ts"
import { cn, isMongoId } from "@/lib/utils.ts"
import { toast } from "@/components/ui/use-toast.ts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx"
import { componentsMap } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx"
import CmsFeedbackDialog from "@/components/custom/cms/components/cms-editor/CmsFeedbackDialog.tsx"

function CmsEditor() {
  const [cmsPost, setCmsPost] = useState<Partial<CmsPost>>({})
  const [components, setComponents] = useState<CmsComponentRef<unknown>[]>([])
  const [componentsToDelete, setComponentsToDelete] = useState<
    CmsComponentRef<unknown>[]
  >([])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isStateActionLoading, setIsStateActionLoading] =
    useState<boolean>(false)
  const [isCreatingCmsPost, setIsCreatingCmsPost] = useState<boolean>(false)
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] =
    useState<boolean>(false)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(cmsPost).length !== 0) {
      // No need to reload the cmsPost if it is already loaded
      // ( happens when navigating from /cms-editor/new to /cms-editor/{id} )
      // ( as we're setting "replace: true" on navigate                       )
      return
    }

    const onLoadCmsPage = (cmsPage: CmsPost) => {
      setCmsPost(cmsPage)
      setComponents(cmsPage.cmsComponents)
      if (cmsPage.hasAuthorReadFeedback === false) {
        setIsFeedbackDialogOpen(true)
        // We can already set hasAuthorReadFeedback to true here, as whenever the user will save / publish something,
        // he'll already have closed the feedback received dialog
        setCmsPost({ ...cmsPage, hasAuthorReadFeedback: true })
      }
    }

    const id = params.id
    if (id && id !== "new" && isMongoId(id)) {
      getCmsPageById(id).then(onLoadCmsPage)
    } else {
      // No id found / id is === "new": let's show the settings dialog
      setIsCreatingCmsPost(true)
    }
  }, [cmsPost, params.id])

  const onSettingsDialogSubmit = async (
    updatedCmsPost: Partial<CmsPost>
  ): Promise<void> => {
    const cmsPostToSend: Partial<CmsPost> = {
      ...cmsPost,
      ...updatedCmsPost,
    }

    // We don't want to send the cms components on the "settings update" in case the user has changed some things in the components they don't want to save
    delete cmsPostToSend.cmsComponents

    await saveCmsPost(cmsPostToSend)

    if (isCreatingCmsPost) {
      // Now the component should have been created for sure, we can set the isCreatingCms post to false
      setIsCreatingCmsPost(false)
    }
  }

  const onSaveClicked = async (): Promise<void> => {
    setIsSaving(true)
    try {
      const deletePromises = []

      for (const deletedComponent of componentsToDelete) {
        const onDeleteEvent =
          componentsMap[deletedComponent.type]?.onDeleteEvent
        if (onDeleteEvent) {
          deletePromises.push(onDeleteEvent(deletedComponent.content))
        }
      }

      // First do the deletion tasks (such as deleting images that have been previously uploaded, etc.)
      await Promise.all(deletePromises)

      // Then continuing with the saving step, which includes uploads of new files to the backend
      const savePromises = []
      for (const component of components) {
        const onSaveComponent = componentsMap[component.type]?.onSaveMap
        if (onSaveComponent) {
          savePromises.push(
            onSaveComponent(component.content).then((result) => {
              component.content = result
            })
          )
        }
      }
      // Call all save promises simultaneously
      await Promise.all(savePromises)
    } catch (err) {
      console.error(err)
    }

    const cmsPostToSend: Partial<CmsPost> = {
      ...cmsPost,
      cmsComponents: components,
    }

    // Finally save the whole post
    try {
      await saveCmsPost(cmsPostToSend)
      setIsSaving(false)
      toast({
        title: "✅ Success!",
        description: "Successfully saved changes",
      })
    } catch (err) {
      setIsSaving(false)
    }
  }

  const onChangeStateClicked = (
    newState: CmsPageState,
    successTitle: string,
    successText: string
  ): void => {
    if (!cmsPost.id) {
      return
    }

    setIsStateActionLoading(true)

    updateCmsPage(cmsPost.id, {
      state: newState,
    })
      .then(() => {
        toast({
          title: successTitle,
          description: successText,
        })

        setCmsPost({ ...cmsPost, state: newState })
      })
      .finally(() => setIsStateActionLoading(false))
  }

  const saveCmsPost = async (
    cmsPostToSend: Partial<CmsPost>
  ): Promise<void> => {
    const id = params.id
    let receivedCmsPost: CmsPost
    if (id && id !== "new" && isMongoId(id)) {
      receivedCmsPost = await updateCmsPage(id, cmsPostToSend)
    } else {
      const cmsPostToCreate: Partial<CmsPost> = {
        // TODO: also add the type in the CmsSettingsDialog
        type: CmsPageType.Info,
        state: CmsPageState.Draft,
        cmsComponents: [],
        ...cmsPostToSend,
      }
      receivedCmsPost = await createCmsPage(cmsPostToCreate)
      navigate(`/cms-editor/${receivedCmsPost.id}`, {
        replace: true,
      })
    }

    setCmsPost(receivedCmsPost)
  }

  const markComponentForDeletion = (id: string) => {
    const componentToDelete = components.find(
      (component) => component.id === id
    )

    if (!componentToDelete) {
      console.warn("Component to delete not found...")
      return
    }

    // Store a reference of the deleted component, so that we can clean it up on save
    const updatedComponentList = components.filter(
      (component) => component.id !== id
    )

    setComponentsToDelete([...componentsToDelete, componentToDelete])
    setComponents(updatedComponentList)
  }

  const renderActionButton = (
    text: string,
    onClick: () => void,
    isLoading: boolean,
    loadingText: string,
    variant:
      | "outline"
      | "link"
      | "default"
      | "destructive"
      | "secondary"
      | "ghost" = "outline",
    isHidden: boolean = false
  ) => (
    <Button
      variant={variant}
      className={cn({
        "bg-neutral-100 border-gray-600 hover:bg-neutral-200":
          variant === "outline",
        hidden: isHidden,
      })}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loading /> <span className="ml-2">{loadingText}</span>
        </>
      ) : (
        text
      )}
    </Button>
  )

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb className="ml-3 mt-3 mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cms-editor/overview">
              CMS Overview
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cmsPost.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-row h-full overflow-hidden">
        <CmsPreviewColumn dynamicComponents={components} cmsPost={cmsPost} />
        <CmsEditorColumn
          components={components}
          setComponents={setComponents}
          markComponentForDeletion={markComponentForDeletion}
          cmsPost={cmsPost}
        >
          <CmsSettingsDialog
            cmsPost={cmsPost}
            isCreatingPost={isCreatingCmsPost}
            onSubmitDialog={onSettingsDialogSubmit}
            isUserInEditor={true}
          >
            <Button className="w-full">Article Settings</Button>
          </CmsSettingsDialog>
        </CmsEditorColumn>
      </div>

      <div className="bg-neutral-100 p-2 flex flex-row justify-end">
        <div className="flex flew-row gap-4">
          <a href={`/blog/${cmsPost.relativeUrl}`} target="_blank">
            <Button
              variant="outline"
              className="bg-neutral-100 border-gray-600 hover:bg-neutral-200"
            >
              Preview
            </Button>
          </a>

          {cmsPost.state === CmsPageState.InReview && (
            // We have to create our own button as TooltipTrigger already contains a button
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger onClick={(e) => e.preventDefault()}>
                  <p
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "default",
                        className:
                          "bg-neutral-100 border-gray-600 hover:bg-neutral-200 pointer-events-none opacity-50",
                      })
                    )}
                  >
                    Read feedback
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-center">
                    No feedback has been added yet. <br />
                    Please come back later
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {(cmsPost.state === CmsPageState.ChangesRequested ||
            cmsPost.state === CmsPageState.Approved) && (
            <CmsFeedbackDialog cmsPost={cmsPost} isOpen={isFeedbackDialogOpen}>
              {renderActionButton(
                "Read feedback",
                () => {},
                false,
                "",
                "outline",
                cmsPost.state === CmsPageState.Approved
              )}
            </CmsFeedbackDialog>
          )}

          {(cmsPost.state === CmsPageState.Draft ||
            cmsPost.state === CmsPageState.ChangesRequested) &&
            renderActionButton(
              "Submit for review",
              async () => {
                await onSaveClicked()
                onChangeStateClicked(
                  CmsPageState.InReview,
                  "✅ Post submitted for review",
                  "An admin will have a look at your post and then approve or suggest improvements"
                )
              },
              isStateActionLoading,
              "Submitting for review"
            )}

          {cmsPost.state === CmsPageState.Approved &&
            renderActionButton(
              "Publish",
              () =>
                onChangeStateClicked(
                  CmsPageState.Published,
                  "✅ Post published",
                  "Your article is now publicly available to everyone"
                ),
              isStateActionLoading,
              "Publishing"
            )}

          {cmsPost.state === CmsPageState.Published &&
            renderActionButton(
              "Unpublish",
              () =>
                onChangeStateClicked(
                  CmsPageState.Approved,
                  "✅ Successfully unpublished",
                  "Your page is now hidden from the public"
                ),
              isStateActionLoading,
              "Un-Publishing"
            )}

          {renderActionButton(
            "Save",
            onSaveClicked,
            isSaving,
            "Saving",
            "default"
          )}
        </div>
      </div>
    </div>
  )
}

export default CmsEditor
