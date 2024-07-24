import React, { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { ADMIN } from "@/constants"
interface ProtectedRouteProps {
  children: ReactNode
  roles: string[]
}
// Problem with header nabiagtion in protected routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, authUserLoadedStatus } = useSelector(
    (state: RootState) => state.authentication
  )
  const userRole = user?.role

  // Display a loading indicator until the user authentication status is fully loaded.
  // This ensures the component only renders when the user data is available, if logged in.
  // preventing redirecting to the unauthorized page before the user data is set.
  if (!authUserLoadedStatus) {
    return <></>
  }

  if (!userRole || !(roles.includes(userRole) || userRole === ADMIN)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}

export default ProtectedRoute
