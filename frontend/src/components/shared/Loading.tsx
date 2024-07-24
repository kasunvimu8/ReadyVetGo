import { FaSpinner } from "react-icons/fa"
import { cn } from "@/lib/utils.ts"

interface LoadingProps {
  className?: string
}
const Loading = ({ className }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <FaSpinner className={cn("animate-spin text-xl", className)} />
      </div>
    </div>
  )
}

export default Loading
