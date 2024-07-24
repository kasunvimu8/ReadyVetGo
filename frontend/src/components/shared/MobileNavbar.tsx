import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LuAlignLeft } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store.ts"
import configs from "@/config/configurations.ts"
import { HeaderNav } from "@/types/nav.ts"
import { Button } from "@/components/ui/button.tsx"
import { useState } from "react"

const MobileNav = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { user } = useSelector((state: RootState) => state.authentication)

  const userHeaderNavLinks = user?.role
    ? configs.headerNav[user.role]
    : configs.defaultHeaderNav

  function onSheetOpenChange(value: boolean): void {
    setSheetOpen(value)
  }

  return (
    <nav className="md:hidden">
      <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
        <SheetTrigger className="align-middle">
          <LuAlignLeft size={25} />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex flex-col gap-6 bg-white md:hidden topest-overlay space-y-1"
        >
          <Link to="/">
            <img src="/Logo.png" alt="ReadyVetGo Logo" className="h-10 mr-4" />
          </Link>

          {userHeaderNavLinks.map((userHeaderLink: HeaderNav) => {
            return (
              <div key={userHeaderLink.id}>
                <div className="text-xl font-bold mt-8">
                  {userHeaderLink.label}
                </div>
                <div>
                  <div className="flex flex-col gap-4">
                    {userHeaderLink.components.map((component) => (
                      <Link to={component.route} key={component.id}>
                        <Button
                          className="w-full"
                          onClick={() => setSheetOpen(false)}
                        >
                          {component.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav
