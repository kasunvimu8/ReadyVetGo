import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import PageTitle from "@/components/shared/PageTitle"
import {
  SubscriptionDataType,
  SubscriptionProductType,
  SubscriptionTypes,
} from "@/types/subscription"
import { useEffect, useState } from "react"
import Loading from "@/components/shared/Loading"
import StripeProvider from "./StripeProvider"
import { getSubscriptions, getSubscriptionPrices } from "@/api/subscription"
import { Badge } from "@/components/ui/badge"
import StripeSubscriptionAction from "@/components/custom/subscriptions/StripeSubscriptionAction"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { LuInfo } from "react-icons/lu"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

const SubscriptionOverview = () => {
  const [products, setProducts] = useState<SubscriptionProductType[]>([])
  const [subscription, setSubscription] = useState<SubscriptionDataType>()
  const [subscriptionChanged, setSubscriptionChanged] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  /** After  user log in, requesting subscription data */
  const { user } = useSelector((state: RootState) => state.authentication)

  /* Get the price data from stripe */
  useEffect(() => {
    const getPriceData = async () => {
      setLoading(true)
      const prices = await getSubscriptionPrices()

      if (prices.length > 0) {
        const productData = prices.map((price) => {
          return {
            id: price.id,
            active: price.active,
            lookupKey: price.lookup_key || "",
            title: price.nickname || "",
            description: price?.metadata?.description || "",
            type:
              (price?.metadata?.type as SubscriptionTypes) ||
              SubscriptionTypes.MONTHLY,
            period: price?.recurring?.interval === "month" ? "Month" : "Year",
            price: (price?.unit_amount || 0) / 100,
          }
        })
        setProducts(productData)
      }
      setLoading(false)
    }

    void getPriceData()
  }, [])

  /* Get the subscription data from stripe */
  useEffect(() => {
    const getSubscriptionData = async () => {
      const subscription = await getSubscriptions()

      if (subscription) {
        const subData = {
          id: subscription.id,
          status: subscription.status,
          priceId: subscription?.plan?.id,
          type:
            (subscription?.plan?.metadata
              ?.subscriptionType as SubscriptionTypes) ||
            SubscriptionTypes.MONTHLY,
          period: subscription?.plan?.interval === "month" ? "Month" : "Year",
          current_period_end: subscription.current_period_end,
          cancel_at: subscription.cancel_at || null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at || null,
        }
        setSubscription(subData)
      }
    }

    // if the user is not loggged in, no user subscription data needed
    if (user) {
      void getSubscriptionData()
    }
  }, [subscriptionChanged, user])

  return (
    <StripeProvider>
      <div className="h-full w-full p-5">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 md:col-span-1">
            <PageTitle title="ReadyVetGo Subscriptions" />
          </div>
        </div>
        <div className="mx-auto py-5">
          <p className="text-sm font-normal">
            We provide expert consultations from qualified veterinary doctors
            24/7. This service is made possible through a monthly or annual
            subscription from our members.
          </p>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap justify-start items-center gap-4 p-2">
            {products.map((prod) => {
              const isSubscribed = subscription?.priceId === prod.id
              const className = cn("w-[400px]", {
                "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80":
                  isSubscribed,
              })

              if (prod.active) {
                return (
                  <Card key={prod.id} className={className}>
                    {isSubscribed && (
                      <div className="relative w-full">
                        <Badge className="absolute top-2 right-2 p-2">
                          Subscribed
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl">{prod.title}</CardTitle>
                      <CardDescription className="text-center">
                        <span className="text-3xl">€{prod.price}</span>
                        {` / ${prod.period}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[130px]">
                      {isSubscribed ? (
                        <>
                          <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="status">
                              Status :{" "}
                              <span className="text-sm font-normal">
                                {subscription.cancel_at_period_end
                                  ? "Canceled at the period end"
                                  : subscription.status}
                              </span>
                            </Label>

                            <Label htmlFor="id">
                              Subscription ID :{" "}
                              <span className="text-sm font-normal capitalize">
                                {subscription.id}
                              </span>
                            </Label>

                            <Label htmlFor="current_period_end">
                              Current Period End :{" "}
                              <span className="text-sm font-normal capitalize">
                                {new Date(
                                  subscription.current_period_end * 1000
                                ).toLocaleDateString("en-GB", {
                                  timeZone: "Europe/Paris",
                                })}
                              </span>
                            </Label>

                            {subscription.canceled_at && (
                              <Label htmlFor="canceled_at">
                                Canceled At :{" "}
                                <span className="text-sm font-normal capitalize">
                                  {new Date(
                                    subscription.canceled_at * 1000
                                  ).toLocaleString("en-GB", {
                                    timeZone: "Europe/Paris",
                                  })}
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost">
                                        <LuInfo />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px] ">
                                      <p className="text-sm font-normal">
                                        You can subscribe to a new plan once
                                        this period ends.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </Label>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm font-normal">
                          {prod.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <StripeSubscriptionAction
                        product={prod}
                        setSubscriptionChanged={setSubscriptionChanged}
                        subscription={subscription}
                      />
                    </CardFooter>
                  </Card>
                )
              }
            })}
          </div>
        )}
      </div>
    </StripeProvider>
  )
}

export default SubscriptionOverview
