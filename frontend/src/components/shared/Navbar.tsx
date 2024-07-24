import { Link } from "react-router-dom"
import { UserNav } from "@/components/shared/UserNav"
import MobileNav from "@/components/shared/MobileNavbar"
import HeaderNavigation from "@/components/shared/HeaderNavigation"
import { Badge } from "../ui/badge"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Role } from "@/types/user.ts"
import { cn } from "@/lib/utils.ts"

const NavBar = () => {
  const { user } = useSelector((state: RootState) => state.authentication)

  const getUserRoleName = () => {
    switch (user?.role) {
      case Role.Farmer:
        return "Farmer"
      case Role.Vet:
        return "Veterinarian"
      case Role.Admin:
        return "Admin"
      default:
        return undefined
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <MobileNav />
        </div>
        <Link to="/">
          <img
            src="/Logo.png"
            alt="ReadyVetGo Logo"
            className="h-10 pr-4 object-contain"
          />
        </Link>
      </div>
      <div className="hidden md:flex text-center">
        <HeaderNavigation />
      </div>
      <div className="flex justify-end space-x-4 mr-4">
        {user && (
          <Badge
            className={cn({
              "bg-[#416279] hover:bg-[#416279]/90": user.role === Role.Vet,
              "bg-[#529175] hover:bg-[#529175]/90": user.role === Role.Farmer,
              "bg-[#304569] hover:bg-[#304569]/90": user.role === Role.Admin,
            })}
          >
            {getUserRoleName()}
          </Badge>
        )}
        <UserNav />
      </div>
    </div>
  )
}

export default NavBar
