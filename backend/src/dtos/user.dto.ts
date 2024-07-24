import { IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateVerifyVetDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;
}

export class AddDocumentDto {
  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  title: string;
}
