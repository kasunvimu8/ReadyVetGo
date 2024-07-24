import { BrowserRouter as Router } from "react-router-dom"
import NavBar from "@/components/shared/Navbar"
import RoutesComponent from "@/components/shared/Routes"
import SheetProvider from "@/components/shared/SheetProvider"
import { Toaster } from "@/components/ui/toaster"
import store from "@/lib/store"
import {
  fetchCurrentUser,
  fetchCurrentUserProfile,
} from "@/reducers/authenticationReducer.ts"
import { User } from "@/types/user.ts"
import { toast } from "@/components/ui/use-toast.ts"
import { ToastAction } from "@/components/ui/toast.tsx"
import { IoIosWarning } from "react-icons/io"
import { resendVerificationEmail } from "@/api/authentication.ts"
import { useEffect } from "react"

function App() {
  const onResendVerificationEmail = () => {
    resendVerificationEmail().finally(() =>
      toast({
        title: "✅ Verification Email Sent",
        description:
          "If you don't receive the email within a few minutes, check your spam folder or request another email.",
      })
    )
  }

  useEffect(() => {
    store.dispatch(fetchCurrentUser()).then(({ payload }) => {
      if (payload === "Invalid user") return

      store.dispatch(fetchCurrentUserProfile())

      const user: User = payload as User
      if (window.location.pathname.startsWith("/verify-email/")) {
        // Only show the email-unverified somewhere else than the verification page
        return
      }

      if (!user.isEmailVerified) {
        toast({
          variant: "warn",
          title: "Your email is unverified",
          icon: <IoIosWarning className="text-2xl" />,
          description: "Please verify your email",
          action: (
            <ToastAction
              altText="Resend link"
              onClick={onResendVerificationEmail}
            >
              Resend link
            </ToastAction>
          ),
        })
      }
    }) // used to fetch the current user to auto login if valid token is present
  }, [])

  return (
    <div className="bg-white h-screen w-full">
      <Router>
        <div className="flex flex-col h-full">
          <SheetProvider />
          <NavBar />
          <div className="flex-grow overflow-auto">
            <RoutesComponent />
          </div>
        </div>
      </Router>
      <Toaster />
    </div>
  )
}

export default App
