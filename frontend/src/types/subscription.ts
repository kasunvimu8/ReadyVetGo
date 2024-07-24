import Stripe from "stripe"

export enum SubscriptionTypes {
  MONTHLY = "monthly",
  ANNUAL = "annual",
}

export type SubscriptionConfig = {
  publishableKey: string
}

export type SubscriptionFormData = {
  name: string
  cardNumber: string
  cvc: string
  expire: string
}

export type SubscriptionCredentials = {
  subscriptionId: string
  clientSecret: string
}

export type SubscriptionProductType = {
  id: string
  lookupKey: string
  title: string
  price: number
  period: string
  description: string
  type: SubscriptionTypes
  active: boolean
}

export type Subscription = Stripe.Subscription & {
  plan: {
    id: string
    interval: string
    metadata: {
      subscriptionType: SubscriptionTypes
    }
  }
}

export type SubscriptionDataType = {
  id: string
  priceId: string
  period: string
  type: SubscriptionTypes
  status: Stripe.Subscription.Status
  cancel_at: number | null
  canceled_at: number | null
  current_period_end: number
  cancel_at_period_end: boolean
}

export type SubscribedCustomer = {
  id: string
  status: string
  customerEmail: string
  planNickname: string
  currentPeriodStart: number
  currentPeriodEnd: number
  receiptUrl: string
  cancelAtPeriodEnd: true
}
