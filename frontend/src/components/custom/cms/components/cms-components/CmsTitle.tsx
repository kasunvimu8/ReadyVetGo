import { Label } from "@/components/ui/label.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import { cn } from "@/lib/utils.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"

enum CmsTitleType {
  Title = "title",
  Subtitle = "subtitle",
  Heading = "heading",
}
interface CmsTitleContent {
  text: string
  type: CmsTitleType
}

const cmsTitleDefaultContent: CmsTitleContent = {
  text: "This is a title",
  type: CmsTitleType.Title,
}

function CmsTitleDisplay({ content }: CmsDisplayProps<CmsTitleContent>) {
  return (
    <h2
      className={cn(
        content.type === CmsTitleType.Title && "text-5xl font-extrabold",
        content.type === CmsTitleType.Subtitle && "text-4xl font-extrabold",
        content.type === CmsTitleType.Heading && "text-3xl tracking-tight",
        "mt-8 mb-2"
      )}
    >
      {content.text}
    </h2>
  )
}

function CmsTitleEditor({
  content,
  onContentChange,
}: CmsEditProps<CmsTitleContent>) {
  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">Text</Label>
          <Input
            id="title"
            value={content.text}
            onChange={(e) =>
              onContentChange({
                ...content,
                text: e.target.value,
              })
            }
            placeholder="Title text"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title-type">Type</Label>
          <Tabs
            id="title-type"
            defaultValue={content.type}
            onValueChange={(titleType) => {
              onContentChange({
                ...content,
                type: titleType as CmsTitleType,
              })
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="title">Title</TabsTrigger>
              <TabsTrigger value="subtitle">Subtitle</TabsTrigger>
              <TabsTrigger value="heading">Heading</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </form>
  )
}

const CmsTitleContainer: CmsContainerInterface<CmsTitleContent> = {
  Display: CmsTitleDisplay,
  Editor: CmsTitleEditor,
  defaultContent: cmsTitleDefaultContent,
}

export { CmsTitleContainer }
