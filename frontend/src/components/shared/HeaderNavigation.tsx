import * as React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import configs from "@/config/configurations"
import { HeaderNav } from "@/types/nav"
import { Link } from "react-router-dom"

const HeaderNavigation = () => {
  const { user } = useSelector((state: RootState) => state.authentication)

  const userHeaderNavLinks = user?.role
    ? configs.headerNav[user.role]
    : configs.defaultHeaderNav

  return (
    <React.Fragment>
      <NavigationMenu>
        <NavigationMenuList>
          {userHeaderNavLinks.map((userHeaderLink: HeaderNav) => {
            return (
              <NavigationMenuItem key={userHeaderLink.id}>
                <NavigationMenuTrigger>
                  <span className="text-xl font-normal">
                    {userHeaderLink.label}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul
                    className={cn(
                      "grid w-[400px] gap-3 p-4 md:w-[500px] grid-cols-2 lg:w-[600px]",
                      {
                        "grid-cols-1": userHeaderLink.components.length === 1,
                      }
                    )}
                  >
                    {userHeaderLink.components.map((component) => (
                      <Link to={component.route} key={component.id}>
                        <ListItem title={component.title}>
                          {component.description}
                        </ListItem>
                      </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </React.Fragment>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <span
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </span>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default HeaderNavigation
