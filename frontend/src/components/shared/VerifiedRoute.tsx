import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { ADMIN } from "@/constants"
import { toast } from "@/components/ui/use-toast.ts";

const VerifiedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.authentication)
  const verifiedStatus = user?.isVerified
  const userRole = user?.role

  if (user && !verifiedStatus && userRole != ADMIN) {
    toast({
      variant: "destructive",
      title: "Not Verified",
      description: "This Feature is only available to verified users. Verification can take some time.",
    })
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default VerifiedRoute
