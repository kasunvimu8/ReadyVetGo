import { Label } from "@/components/ui/label.tsx"
import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"

enum CmsButtonVariants {
  Default = "default",
  Outline = "outline",
  Secondary = "secondary",
}
interface CmsButtonContent {
  text: string
  redirectUrl?: string
  variant: CmsButtonVariants
}

const cmsButtonDefaultContent: CmsButtonContent = {
  text: "This is a text",
  redirectUrl: "https://readyvetgo.de",
  variant: CmsButtonVariants.Default,
}

function CmsButtonDisplay({ content }: CmsDisplayProps<CmsButtonContent>) {
  return (
    <Button variant={content.variant} className="my-4">
      <a href={content.redirectUrl} target="_blank">
        {content.text}
      </a>
    </Button>
  )
}

function CmsButtonEditor({
  content,
  onContentChange,
}: CmsEditProps<CmsButtonContent>) {
  return (
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="text">Text</Label>
          <Input
            id="text"
            placeholder="Type your text here."
            value={content.text}
            onChange={(e) =>
              onContentChange({
                ...content,
                text: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="redirectUrl">Redirect URL</Label>
          <Input
            id="redirectUrl"
            placeholder="https://readyvetgo.de"
            value={content.redirectUrl}
            onChange={(e) =>
              onContentChange({
                ...content,
                redirectUrl: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>Variant</Label>

          <Select
            onValueChange={(value) =>
              onContentChange({
                ...content,
                variant: value as CmsButtonVariants,
              })
            }
            defaultValue={content.variant}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a component" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.keys(CmsButtonVariants).map((variant) => (
                  <SelectItem value={variant.toLowerCase()} key={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
}

const CmsButtonContainer: CmsContainerInterface<CmsButtonContent> = {
  Display: CmsButtonDisplay,
  Editor: CmsButtonEditor,
  defaultContent: cmsButtonDefaultContent,
}

export { CmsButtonContainer }
