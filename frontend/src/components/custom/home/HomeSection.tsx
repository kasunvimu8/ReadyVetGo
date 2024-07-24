import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils.ts"

interface HomeSectionProps {
  title: string
  variant?: "dark" | "light"
}
export default function HomeSection({
  title,
  variant,
  children,
}: PropsWithChildren<HomeSectionProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 w-full bg-[linear-gradient(45deg,rgba(55,150,91,0.1)0%,rgba(18,42,100,0.1)100%)] text-[#122A41]",
        {
          "bg-[linear-gradient(45deg,rgba(18,42,100,0.8)0%,rgba(55,150,91,0.8)100%)] text-white":
            variant === "dark",
        }
      )}
    >
      <h2
        className={cn(
          "text-white text-5xl font-light text-center mb-8",
          variant === "dark" ? "text-white" : "text-[#122A41]"
        )}
      >
        {title}
      </h2>

      {children}
    </div>
  )
}
