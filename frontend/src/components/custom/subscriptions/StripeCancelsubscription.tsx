import { cancelSubscription } from "@/api/subscription"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

const StripeCancelsubscription = ({
  subscriptionId,
  setOpen,
  setSubscriptionChanged,
}: {
  subscriptionId: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSubscriptionChanged: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { toast } = useToast()

  const onSubscriptionCanceled = async () => {
    /** cancel subscription api call */
    const res = await cancelSubscription(subscriptionId)
    if (res) {
      toast({
        title: "✅ Success!",
        description: "Subscription canceled successfully",
      })

      setSubscriptionChanged((subscriptionChanged) => !subscriptionChanged)
      setOpen(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogDescription className="pt-2">
          Click continue to cancel your subscription. After cancellation, you
          can still use the services with your current subscription until the
          end date of the current billing period.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4"></div>
      <DialogFooter>
        <Button onClick={onSubscriptionCanceled}>Continue</Button>
      </DialogFooter>
    </>
  )
}

export default StripeCancelsubscription
