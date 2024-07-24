import { ReactNode, useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import Loading from "@/components/shared/Loading"
import { getSubscriptionConfigs } from "@/api/subscription"

const StripeProvider = ({ children }: { children: ReactNode }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>()

  useEffect(() => {
    const getConfigs = async () => {
      const configs = await getSubscriptionConfigs()

      if (configs.publishableKey) {
        const stripe = loadStripe(configs.publishableKey)
        setStripePromise(stripe)
      }
    }
    void getConfigs()
  }, [])

  return stripePromise ? (
    <Elements stripe={stripePromise}>{children}</Elements>
  ) : (
    <Loading />
  )
}

export default StripeProvider
