import { Label } from "@/components/ui/label.tsx"
import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"
import { Textarea } from "@/components/ui/textarea.tsx"

const cmsTextDefaultContent: string = "This is a text"

function CmsTextDisplay({ content }: CmsDisplayProps<string>) {
  return <p className="[white-space:break-spaces]">{content}</p>
}

function CmsTextEditor({ content, onContentChange }: CmsEditProps<string>) {
  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            placeholder="Type your text here."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
        </div>
      </div>
    </form>
  )
}

const CmsTextContainer: CmsContainerInterface<string> = {
  Display: CmsTextDisplay,
  Editor: CmsTextEditor,
  defaultContent: cmsTextDefaultContent,
}

export { CmsTextContainer }
