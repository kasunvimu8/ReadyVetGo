import PageTitle from "@/components/shared/PageTitle"
import AllSubscriptionTable from "./AllSubscriptionTable"

const AllSubscriptions = () => {
  return (
    <div className="h-full w-full p-5 overflow-auto [contain:content]">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 md:col-span-1">
          <PageTitle title="Customer Subscriptions" />
        </div>
      </div>
      <div className="mx-auto py-5">
        <AllSubscriptionTable />
      </div>
    </div>
  )
}

export default AllSubscriptions
