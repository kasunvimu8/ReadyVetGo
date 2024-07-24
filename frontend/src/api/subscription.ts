import { GET, POST } from "@/lib/http"
import {
  Subscription,
  SubscriptionConfig,
  SubscriptionCredentials,
} from "@/types/subscription"
import Stripe from "stripe"

export const getSubscriptionConfigs = async () => {
  return await GET<SubscriptionConfig>("/subscription/config")
}

export const getSubscriptionPrices = async () => {
  return await GET<Stripe.Price[]>("/subscription/prices")
}

export const getSubscriptions = async () => {
  return await GET<Subscription>("/subscription/subscriptions")
}
export const getAllSubscriptions = async () => {
  return await GET<any>("/subscription/allSubscriptions")
}

export const createSubscription = async (priceId: string, email: string) =>
  POST<SubscriptionCredentials, { priceId: string; email: string }>(
    "/subscription/create-subscription",
    {
      priceId: priceId,
      email: email,
    }
  )

export const cancelSubscription = async (subscriptionId: string) =>
  POST<Subscription, { subscriptionId: string }>(
    "/subscription/cancel-subscription",
    {
      subscriptionId: subscriptionId,
    }
  )
