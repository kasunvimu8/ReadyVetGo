import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import Loading from "@/components/shared/Loading"
import { getColumns } from "@/components/custom/cms/components/cms-overview/CmsOverviewTableColumns.tsx"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"
import { getOwnCmsPages, updateCmsPage } from "@/api/cms.ts"

const visibility = {
  id: true,
  userName: true,
  status: true,
  action: false,
}

const CmsOverviewTable = () => {
  const [cmsPosts, setCmsPosts] = useState<CmsPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getOwnCmsPages().then((cmsPages) => {
      setCmsPosts(cmsPages)
      setLoading(false)
    })
  }, [])

  const onUpdateSettings = async (updatedPost: Partial<CmsPost>) => {
    if (!updatedPost.id) {
      return
    }
    const updatedCmsPage = await updateCmsPage(updatedPost.id, updatedPost)
    setCmsPosts(
      cmsPosts.map((post) =>
        post.id === updatedPost.id ? updatedCmsPage : post
      )
    )
  }

  if (loading) return <Loading />

  return (
    <DataTable
      columns={getColumns(onUpdateSettings)}
      data={cmsPosts}
      visibility={visibility}
      filterId="title"
      filterDescription="Filter by title"
    />
  )
}

export default CmsOverviewTable
