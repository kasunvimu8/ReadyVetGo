import PageTitle from "@/components/shared/PageTitle"
import CmsOverviewTable from "@/components/custom/cms/components/cms-overview/CmsOverviewTable.tsx"
import { Button } from "@/components/ui/button.tsx"
import { PlusIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"

const CmsOverview = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="w-full p-5 overflow-auto [contain:content]">
        <div className="">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 md:col-span-1">
              <PageTitle title="CMS Overview" />
            </div>
          </div>
          <div className="mx-auto pt-5">
            <CmsOverviewTable />
          </div>
        </div>
      </div>
      <div className="bg-neutral-100 p-2 flex flex-row justify-end w-full">
        <div className="flex flew-row gap-4">
          <Link to={"/cms-editor/new"}>
            <Button>
              <PlusIcon color={"white"} className="mr-2 h-4 w-4" />
              Create New Blog Post
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CmsOverview
