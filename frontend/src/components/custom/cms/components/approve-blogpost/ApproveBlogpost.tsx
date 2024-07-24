import PageTitle from "@/components/shared/PageTitle.tsx"
import ApproveBlogpostTable from "@/components/custom/cms/components/approve-blogpost/ApproveBlogpostTable.tsx"

const ApproveBlogpost = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Approve Blogposts" />
        </div>
      </div>
      <div className="mx-auto py-5">
        <ApproveBlogpostTable />
      </div>
    </div>
  )
}

export default ApproveBlogpost
