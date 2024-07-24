import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable.tsx"
import { getColumns } from "./ApproveBlogpostColumns.tsx"
import Loading from "@/components/shared/Loading.tsx"
import {
  CmsPageState,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { getCmsPagesInReview, updateCmsPage } from "@/api/cms.ts"

const visibility = {
  id: true,
  title: true,
  createdDate: false,
  createdBy: true,
}

const ApproveBlogpostTable = () => {
  const [cmsPosts, setCmsPosts] = useState<CmsPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getCmsPagesInReview().then((cmsPages) => {
      setCmsPosts(cmsPages)
      setLoading(false)
    })
  }, [])

  const onFeedbackGiven = async (
    cmsPost: CmsPost,
    newState: CmsPageState,
    feedback?: string
  ) => {
    const updatedCmsPage = await updateCmsPage(cmsPost.id, {
      state: newState,
      authorFeedback: feedback ?? "",
      hasAuthorReadFeedback: false,
    })
    setCmsPosts(
      cmsPosts.map((post) =>
        post.id === updatedCmsPage.id ? updatedCmsPage : post
      )
    )
  }

  if (loading) return <Loading />

  return (
    <DataTable
      columns={getColumns(onFeedbackGiven)}
      data={cmsPosts}
      visibility={visibility}
      filterId="title"
      filterDescription="Filter by title"
    />
  )
}

export default ApproveBlogpostTable
