import {
  cancelSubscription,
  createSubscription,
  getAllSubscriptions,
  getStripeConfig,
  getStripePrices,
  getSubscriptions,
} from "@controllers/subscription.controller";
import {
  cancelsubscriptionDto,
  createSubscriptionDto,
} from "@dtos/subscription.dto";
import { validationMiddleware } from "@middlewares/validation.middleware";
import { Router } from "express";

const router = Router();

router.get("/config", getStripeConfig);
router.get("/prices", getStripePrices);
router.get("/subscriptions", getSubscriptions);
router.get("/allSubscriptions", getAllSubscriptions);

router.post(
  "/create-subscription",
  validationMiddleware(createSubscriptionDto),
  createSubscription
);
router.post(
  "/cancel-subscription",
  validationMiddleware(cancelsubscriptionDto),
  cancelSubscription
);

export default router;
