import React, { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  SubscriptionDataType,
  SubscriptionProductType,
} from "@/types/subscription"
import StripePaymentMethod from "@/components/custom/subscriptions/StripePaymentMethod"
import StripeCancelsubscription from "@/components/custom/subscriptions/StripeCancelsubscription"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { openSheet } from "@/types/sheetAction"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"

const StripeSubscriptionAction = ({
  product,
  subscription,
  setSubscriptionChanged,
}: {
  product: SubscriptionProductType
  subscription: SubscriptionDataType | undefined
  setSubscriptionChanged: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  /** User Data from redux */
  const { user } = useSelector((state: RootState) => state.authentication)

  // true when user has any subscription
  const isSubscribed = Boolean(subscription)
  // true when user has subscribed in to this perticular product
  const subscribedProduct = subscription?.priceId === product.id
  // true when the subscription is canceled but the period is not end yet
  const canceledAtEnd = subscription?.cancel_at_period_end
  // true when this product is cancelled and still the period is not finished
  const currrentCancelledSubscription = subscribedProduct && canceledAtEnd

  // check if the user is logged in
  const handleActionClick = async () => {
    if (!user) {
      setOpen(false)
      dispatch(openSheet("login"))
    } else {
      setOpen(() => !open)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        handleActionClick()
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={
            (isSubscribed && !subscribedProduct) ||
            currrentCancelledSubscription
          }
        >
          {subscribedProduct && !canceledAtEnd ? "Cancel" : "Subscribe"}
        </Button>
      </DialogTrigger>
      {user && (
        <DialogContent className="sm:max-w-[425px]" hasCloseButton={true}>
          {subscribedProduct ? (
            <StripeCancelsubscription
              subscriptionId={subscription.id}
              setSubscriptionChanged={setSubscriptionChanged}
              setOpen={setOpen}
            />
          ) : (
            <StripePaymentMethod
              product={product}
              setSubscriptionChanged={setSubscriptionChanged}
              setOpen={setOpen}
            />
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}

export default StripeSubscriptionAction
