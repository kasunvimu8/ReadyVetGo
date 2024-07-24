import {
  CmsDisplayProps,
  CmsEditProps,
} from "@/components/custom/cms/models/cms-props.interface.ts"
import CmsContainerInterface from "@/components/custom/cms/models/cms-container.interface.ts"
import { CmsTextContainer } from "@/components/custom/cms/components/cms-components/CmsText.tsx"
import { CmsTitleContainer } from "@/components/custom/cms/components/cms-components/CmsTitle.tsx"
import { CmsButtonContainer } from "@/components/custom/cms/components/cms-components/CmsButton.tsx"
import { CmsQuoteContainer } from "@/components/custom/cms/components/cms-components/CmsQuote.tsx"
import { CmsImageContainer } from "@/components/custom/cms/components/cms-components/CmsImage.tsx"
import { CmsComponentEditCard } from "@/components/custom/cms/components/cms-editor/CmsComponentEditCard.tsx"

// Specify here how a `componentTitle` refers to an actual React CMS component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentsMap: Record<string, CmsContainerInterface<any>> = {
  title: CmsTitleContainer,
  text: CmsTextContainer,
  button: CmsButtonContainer,
  quote: CmsQuoteContainer,
  image: CmsImageContainer,
}

export const componentFactoryDisplay = (
  type: string,
  displayProps: CmsDisplayProps<unknown>
) => {
  const Component = componentsMap[type]
  if (!Component) {
    console.warn(
      `componentFactoryDisplay: component of type ${type} has not been found in the componentsMap`
    )
    return null
  }

  if (displayProps.content == null) {
    displayProps.content = Component.defaultContent
  }

  return Component ? <Component.Display {...displayProps} /> : null
}

export const componentFactoryEditor = (
  id: string,
  type: string,
  editProps: CmsEditProps<unknown>
) => {
  const Component = componentsMap[type]
  if (!Component) {
    console.warn(
      `componentFactoryEditor: component of type ${type} has not been found in the componentsMap`
    )
    return null
  }

  if (editProps.content == null) {
    editProps.content = Component.defaultContent
  }

  return (
    <CmsComponentEditCard id={id} editProps={editProps} type={type}>
      <Component.Editor {...editProps} />
    </CmsComponentEditCard>
  )
}
