import React, { useState } from "react"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { BsCreditCard2BackFill } from "react-icons/bs"
import { FaCcVisa } from "react-icons/fa"
import { SubscriptionProductType } from "@/types/subscription"
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"
import {
  StripeCardNumberElement,
  StripeElementChangeEvent,
} from "@stripe/stripe-js"
import { createSubscription } from "@/api/subscription"
import { useToast } from "@/components/ui/use-toast"
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"
import Loading from "@/components/shared/Loading"

const StripePaymentMethod = ({
  product,
  setSubscriptionChanged,
  setOpen,
}: {
  product: SubscriptionProductType
  setSubscriptionChanged: React.Dispatch<React.SetStateAction<boolean>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [name, setName] = useState<string>("")

  /** User Data from redux */
  const { user } = useSelector((state: RootState) => state.authentication)

  /* Validation - zod or other lib. cannot use as stripe element values are not readable for security reasons */
  const [isNameValid, setIsNameValid] = useState(false)
  const [expiryValid, setExpiryValid] = useState(false)
  const [cardNumberValid, setCardNumberValid] = useState(false)
  const [cvcValid, setCvcValid] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  /**
   * 1) First Create subscription in stripe with backend call
   * 2). Then get the subscription Id and client secret with the subscription response
   * 3). Then confirm the card payment for the subscription with stripe api call
   * */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const cardNumberElement = elements?.getElement(CardNumberElement)
      const cardExpiryElement = elements?.getElement(CardExpiryElement)
      const cardCvcElement = elements?.getElement(CardCvcElement)
      const email = user?.email

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        toast({
          title: "Subscription Failed",
          description: "One or more card elements not found",
          variant: "destructive",
        })
      } else if (!email) {
        toast({
          title: "User is not logged in",
          description: "Please login to make this subscription",
          variant: "destructive",
        })
      } else {
        /** Create subscription and get the subscription Id and client secret */
        const res = await createSubscription(product.id, email)

        if (res.subscriptionId && res.clientSecret) {
          /** Directly call safe confirm card payments in stripe  */
          const paymentIntentResult = await stripe?.confirmCardPayment(
            res.clientSecret,
            {
              payment_method: {
                card: cardNumberElement as StripeCardNumberElement,
                billing_details: {
                  name: name,
                },
                metadata: {
                  email: email,
                },
              },
            }
          )

          if (paymentIntentResult?.paymentIntent?.status === "succeeded") {
            toast({
              title: "✅ Success!",
              description: "Subscription created successfully",
            })
            setSubscriptionChanged(true)
          } else {
            toast({
              title: "Subscription Failed",
              description:
                paymentIntentResult?.error?.message || "Subscription Failed",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Subscription Failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setName(value)
    setIsNameValid(value !== "")
  }

  const elementOptions = {
    classes: {
      base: "h-9 w-full rounded-md border border-input px-3 pt-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      complete: "border-green-600",
      empty: "border-gray-300",
      focus: "border-blue-600",
      invalid: "border-red-600",
    },
  }

  const handleCardNumberChange = (event: StripeElementChangeEvent) => {
    setCardNumberValid(event.complete)
  }

  const handleCardExpiryChange = (event: StripeElementChangeEvent) => {
    setExpiryValid(event.complete)
  }

  const handleCardCvcChange = (event: StripeElementChangeEvent) => {
    setCvcValid(event.complete)
  }

  return (
    <>
      {stripe && elements && (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <DialogHeader className="flex justify-center items-center">
            <div>
              <DialogTitle className="text-center">{product.title}</DialogTitle>
              <div className="text-center text-sm font-bold text-muted-foreground">
                <span className="text-2xl">€{product.price}</span>
                {` / ${product.period}`}{" "}
              </div>
              <DialogDescription>
                Please provide your payment details here
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <RadioGroup defaultValue="card" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <BsCreditCard2BackFill className="mb-3 h-6 w-6" />
                  Credit Card
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="visa"
                  id="visa"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="visa"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FaCcVisa className="mb-3 h-6 w-6" />
                  Visa
                </Label>
              </div>
            </RadioGroup>

            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="First Last"
              value={name}
              onChange={handleInputChange}
            />

            <Label htmlFor="cardNumber">Card number</Label>
            <CardNumberElement
              options={elementOptions}
              onChange={handleCardNumberChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expireDate">Expiration Date</Label>
                <CardExpiryElement
                  options={elementOptions}
                  onChange={handleCardExpiryChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expireDate">CVC</Label>
                <CardCvcElement
                  options={elementOptions}
                  onChange={handleCardCvcChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                !(
                  isNameValid &&
                  cardNumberValid &&
                  expiryValid &&
                  cvcValid &&
                  !loading
                )
              }
            >
              <span className="px-2">Continue</span>
              {loading && <Loading />}
            </Button>
          </DialogFooter>
        </form>
      )}
    </>
  )
}

export default StripePaymentMethod
