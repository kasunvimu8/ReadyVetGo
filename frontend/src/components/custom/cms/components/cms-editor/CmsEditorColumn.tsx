import { Dispatch, PropsWithChildren, SetStateAction } from "react"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import CmsNewComponentDialog from "@/components/custom/cms/components/cms-editor/CmsNewComponentDialog.tsx"
import {
  componentFactoryEditor,
  componentsMap,
} from "@/components/custom/cms/utils/cms-component-factory.tsx"
import CmsComponentRef from "@/components/custom/cms/models/cms-component-ref.interface.ts"
import { v4 as uuidv4 } from "uuid"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"
import { CmsStatePill } from "@/components/custom/cms/components/cms-editor/CmsStatePill.tsx"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

interface CmsEditColumnProps {
  components: CmsComponentRef<unknown>[]
  setComponents: Dispatch<SetStateAction<CmsComponentRef<unknown>[]>>
  markComponentForDeletion: (id: string) => void
  cmsPost: Partial<CmsPost>
}

export default function CmsEditorColumn({
  components,
  setComponents,
  markComponentForDeletion,
  cmsPost,
  children,
}: PropsWithChildren<CmsEditColumnProps>) {
  const sensors = useSensors(useSensor(PointerSensor))

  const updateComponentContent = (id: string, newContent: unknown) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, content: newContent } : comp
      )
    )
  }

  const onComponentAdd = (componentType: string) => {
    const newComponent = componentsMap[componentType]
    if (!newComponent) {
      console.error(`Component of type ${componentType} has not been found!`)
      return
    }

    const cmsComponentRef: CmsComponentRef<unknown> = {
      id: uuidv4(),
      type: componentType,
      content: newComponent.defaultContent,
    }

    setComponents((prevComponents) => [...prevComponents, cmsComponentRef])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over != null && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex(
          (component) => component.id === active.id
        )
        const newIndex = items.findIndex(
          (component) => component.id === over.id
        )

        if (oldIndex === -1 || newIndex === -1) {
          return items
        }

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <ScrollArea className="w-1/3 rounded-md border m-2">
      <div className="flex flex-col p-4 gap-4">
        <Card>
          <CardHeader className="relative">
            <CardTitle className="capitalize">Article Overview</CardTitle>
            <img
              src={
                cmsPost?.thumbnailUrl
                  ? `${fileUploadUrl}/${cmsPost.thumbnailUrl}`
                  : "/no-image.jpg"
              }
              alt="Blogpost Picture"
              className="w-full object-cover rounded-lg"
            />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">{cmsPost.title} </p>

            {cmsPost.state && <CmsStatePill state={cmsPost.state} />}

            {cmsPost.createdBy && (
              <p className="text-xl py-2 font-light">
                By {cmsPost.createdBy?.firstName} {cmsPost.createdBy?.lastName}
              </p>
            )}

            {/* Article Settings */}
            {children}
          </CardContent>
        </Card>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={components}
            strategy={verticalListSortingStrategy}
          >
            {components.map((component) => (
              <div key={component.id}>
                {componentFactoryEditor(component.id, component.type, {
                  content: component.content,
                  onContentChange: (newContent: unknown) =>
                    updateComponentContent(component.id, newContent),
                  onDeleteClick: () => markComponentForDeletion(component.id),
                })}
              </div>
            ))}
          </SortableContext>
        </DndContext>

        <CmsNewComponentDialog onComponentAdd={onComponentAdd} />
      </div>
    </ScrollArea>
  )
}
