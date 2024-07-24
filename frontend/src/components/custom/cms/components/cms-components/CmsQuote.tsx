import { Label } from "@/components/ui/label.tsx"
import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"
import { Textarea } from "@/components/ui/textarea.tsx"

const cmsQuoteDefaultContent: string = "This is a text"

function CmsQuoteDisplay({ content }: CmsDisplayProps<string>) {
  return <blockquote className="border-l-2 pl-6 italic">{content}</blockquote>
}

function CmsQuoteEditor({ content, onContentChange }: CmsEditProps<string>) {
  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="text">Quote Text</Label>
          <Textarea
            id="text"
            placeholder="Type your quote here."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
        </div>
      </div>
    </form>
  )
}

const CmsQuoteContainer: CmsContainerInterface<string> = {
  Display: CmsQuoteDisplay,
  Editor: CmsQuoteEditor,
  defaultContent: cmsQuoteDefaultContent,
}

export { CmsQuoteContainer }
