import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { getColumns } from "./AllSubscriptionTableColumn"
import Loading from "@/components/shared/Loading"
import { getAllSubscriptions } from "@/api/subscription"
import { SubscribedCustomer } from "@/types/subscription"

const visibility = {
  id: false,
  status: true,
  customerEmail: true,
  planNickname: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  receiptUrl: true,
  cancelAtPeriodEnd: true,
}

const AllSubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState<SubscribedCustomer[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const subData = await getAllSubscriptions()
      setSubscriptions(subData)
      setLoading(false)
    })()
  }, [])

  if (loading) return <Loading />
  return (
    <DataTable
      columns={getColumns()}
      data={subscriptions}
      visibility={visibility}
      filterId="email"
      filterDescription="Filter by email"
    />
  )
}

export default AllSubscriptionTable
