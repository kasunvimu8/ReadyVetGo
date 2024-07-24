/// Props used for the CMS components that are displaying content of generic type T
export interface CmsDisplayProps<T> {
  content: T
}

/// Props used for the CMS components that are editing content of generic type T
export interface CmsEditProps<T> {
  onContentChange: (changes: T) => void
  content: T
  onDeleteClick: () => void
}
