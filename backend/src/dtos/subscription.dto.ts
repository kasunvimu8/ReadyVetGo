import { IsNotEmpty, IsString } from "class-validator";

export class createSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  priceId: string;
}

export class cancelsubscriptionDto {
  @IsString()
  @IsNotEmpty()
  subscriptionId: string;
}
