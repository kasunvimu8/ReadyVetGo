import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { TbGripVertical } from "react-icons/tb"
import { Cross1Icon } from "@radix-ui/react-icons"
import { CmsEditProps } from "@/components/custom/cms/models/cms-props.interface.ts"
import { PropsWithChildren } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils.ts"

interface CmsComponentEditCardProps {
  id: string
  type: string
  editProps: CmsEditProps<unknown>
}
export function CmsComponentEditCard({
  id,
  type,
  editProps,
  children,
}: PropsWithChildren<CmsComponentEditCardProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: `translateY(${transform?.y ?? 0}px)`,
    transition,
    zIndex: isDragging ? 1000 : "auto",
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn({ "outline outline-gray-400": isDragging }, "relative")}
    >
      <CardHeader className="relative">
        <Button
          className="absolute left-3 top-1 text-2xl p-1 text-primary/50 -ml-2 h-auto cursor-grab"
          variant="ghost"
          {...listeners}
        >
          <TbGripVertical />
        </Button>

        <CardTitle className="capitalize">{type}</CardTitle>

        <Button
          className="absolute right-1 top-0 text-destructive text-base hover:text-destructive hover:bg-red-100"
          variant="ghost"
          onClick={editProps.onDeleteClick}
        >
          <Cross1Icon />
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
