import config from "@configs/env.config";
import { Role } from "@interfaces/user.interface";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "src/exceptions/HttpException";
import { throwUnauthorizedError } from "src/utils/util";
import Stripe from "stripe";

const stripe = new Stripe(config.stripeSecretKey);

/* get existing customer by email */
export const getCustomer = async (
  email: string
): Promise<Stripe.Customer | undefined> => {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    } else {
      return undefined;
    }
  } catch (err) {
    console.error(`Error retrieving customer: ${email}`, err);
    return undefined;
  }
};

/* Create Subscription */
const createCustomer = async (
  email: string
): Promise<Stripe.Customer | undefined> => {
  let customer;
  try {
    if (email) {
      const existingCustomer = await getCustomer(email);

      if (!existingCustomer) {
        customer = await stripe.customers.create({
          email: email,
        });
      } else {
        customer = existingCustomer;
      }

      return customer;
    }
  } catch (err) {
    console.error(err);
  } finally {
    return customer;
  }
};

/* get stripe config */
export const getStripeConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.send({
      publishableKey: config.stripePublishableKey,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* get stripe price data */
export const getStripePrices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const prices = await stripe.prices.list({
      lookup_keys: ["monthly_basic_subscription", "annual_basic_subscription"],
      expand: ["data.product"],
    });

    res.send(prices.data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* get subscription data */
export const getSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req?.authorized_user;
    const email = user?.email;
    if (email) {
      const customer = await getCustomer(email);
      if (customer && customer.id) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          expand: ["data.default_payment_method"],
        });

        res.json(subscriptions?.data?.[0]);
      } else {
        // sending no data for logged in users who don't have subscription
        res.status(200).json();
      }
    } else {
      // sending no data for not logged in users
      res.status(200).json();
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* Create Subscription */
export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    if (req.authorized_user?.role === Role.Vet) {
      throw new HttpException(
        403,
        "Only authenticated farmers can create chats"
      );
    }
    if (req.authorized_user?.subscriptionActive) {
      throw new HttpException(
        403,
        "You already have an active subscription for the subscribed period"
      );
    }

    const { email, priceId } = req.body;
    const customer = await createCustomer(email);

    if (customer && customer.id) {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      const latestInvoice =
        typeof subscription.latest_invoice === "object"
          ? subscription.latest_invoice
          : null;
      const paymentIntent = latestInvoice?.payment_intent;

      const clientSecret =
        typeof paymentIntent === "object" ? paymentIntent?.client_secret : null;

      res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: clientSecret,
      });
    } else {
      res.status(500).json({ message: "Error creating the customer" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* Cancel Subscription  */
export const cancelSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { subscriptionId } = req.body;
    if (!req.authorized_user) {
      return throwUnauthorizedError(req);
    }

    if (req.authorized_user?.role === Role.Vet) {
      throw new HttpException(
        403,
        "Only authenticated farmers can create chats"
      );
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.status(200).json({ subscription: subscription });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/** Check the given user email susbcription */
export const getUserSubscriptionData = async (email: string) => {
  try {
    if (email) {
      const customer = await getCustomer(email);
      if (customer && customer.id) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          expand: ["data.default_payment_method"],
        });

        return subscriptions?.data?.[0];
      } else {
        return;
      }
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

/* get all subscription data */
export const getAllSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req?.authorized_user;
    if (user?.role === Role.Admin) {
      const subscriptions = await stripe.subscriptions.list();
      const subscriptionDetails = await Promise.all(
        subscriptions.data.map(async (subscription) => {
          try {
            const customer = await stripe.customers.retrieve(
              subscription.customer as string
            );
            if (customer.deleted) {
              return null;
            }

            // Fetch the latest invoice for the subscription
            const invoices = await stripe.invoices.list({
              subscription: subscription.id,
              limit: 1,
            });
            const receiptUrl =
              invoices.data.length > 0
                ? invoices.data[0].hosted_invoice_url
                : null;

            return {
              id: subscription.id,
              status: subscription.status,
              email: (customer as Stripe.Customer).email,
              planNickname: subscription.items.data[0]?.plan.nickname,
              currentPeriodStart: subscription.current_period_start,
              currentPeriodEnd: subscription.current_period_end,
              receiptUrl: receiptUrl,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            };
          } catch (error) {
            return null;
          }
        })
      );

      const filteredSubscriptionDetails = subscriptionDetails.filter(
        (subscription) => subscription !== null
      );

      res.status(200).json(filteredSubscriptionDetails);
    } else {
      res.status(403).json("You do not have permission to perform this action");
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
