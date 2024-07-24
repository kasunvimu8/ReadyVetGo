// src/config.ts
import dotenv from "dotenv";
dotenv.config();
interface Config {
  port: string;
  mongoURL: string;
  db: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
  monthlyPriceId: string;
  annualPriceId: string;
  endpointSecret: string;
}

function validateEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getConfig(): Config {
  return {
    port: validateEnvVariable("SERVER_PORT"),
    mongoURL: validateEnvVariable("MONGO_URL"),
    db: validateEnvVariable("DB_NAME"),
    stripeSecretKey: validateEnvVariable("STRIPE_SECRET_KEY"),
    stripePublishableKey: validateEnvVariable("STRIPE_PUBLISHABLE_KEY"),
    monthlyPriceId: validateEnvVariable("STRIPE_PRODUCT_MONTHLY"),
    annualPriceId: validateEnvVariable("STRIPE_PRODUCT_ANNUAL"),
    endpointSecret: validateEnvVariable("STRIPE_WEBHOOK_SECRET"),
  };
}

const config = getConfig();
export default config;
