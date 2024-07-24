import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import configs from "@/config/configurations"
import { NavItem } from "@/types/nav"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "@/api/authentication.ts"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store.ts"
import {
  clearCurrentProfile,
  clearCurrentUser,
  setAuthUserLoadingStatus,
} from "@/reducers/authenticationReducer.ts"
import { openSheet } from "@/types/sheetAction.ts"
import Loading from "@/components/shared/Loading.tsx"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

export function UserNav() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, profile } = useSelector(
    (state: RootState) => state.authentication
  )
  const navigate = useNavigate()

  // todo this is just for now a quick solution to login
  const handleOpenLogInSheet = () => {
    dispatch(openSheet("login"))
  }
  if (!user) {
    // the parent must handle this case
    return <Button onClick={handleOpenLogInSheet}>Login</Button>
  }

  if (!profile) {
    return <Loading />
  }

  const handleLogout = async () => {
    await logout()
    // todo add error handling and check
    dispatch(clearCurrentUser())
    dispatch(setAuthUserLoadingStatus(false))
    dispatch(clearCurrentProfile())

    // navigate to home page after loogout
    navigate("/", {
      replace: true,
    })
  }

  // todo add loading state
  const handleLogoutClick = () => {
    handleLogout()
  }

  const userNavLinks = configs.userNav[user.role]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                !profile?.profileImageUrl
                  ? "/Avatar.png"
                  : `${fileUploadUrl}/${profile.profileImageUrl}`
              }
              alt="readyvetgo"
              className="object-cover"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground"></p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userNavLinks.map((link: NavItem) => {
            return (
              <Link to={link.route} key={link.id}>
                <DropdownMenuItem>{link.label}</DropdownMenuItem>
              </Link>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogoutClick}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
