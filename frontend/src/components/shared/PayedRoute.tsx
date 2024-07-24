import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { ADMIN } from "@/constants"

const PayedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.authentication)
  const subscriptionsStatus = user?.subscriptionActive
  const userRole = user?.role

  if (user && !subscriptionsStatus && userRole != ADMIN) {
    return <Navigate to="/subscriptions" />
  }

  return <>{children}</>
}

export default PayedRoute
