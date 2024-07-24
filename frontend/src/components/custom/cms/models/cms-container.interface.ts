import { ComponentType } from "react"
import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"

export default interface CmsContainerInterface<T> {
  Display: ComponentType<CmsDisplayProps<T>>
  Editor: ComponentType<CmsEditProps<T>>
  defaultContent: T
  onSaveMap?: (currentState: T) => Promise<T>
  onDeleteEvent?: (currentState: T) => Promise<void>
}
