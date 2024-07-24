import { SEX } from "@models/medical-record";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
} from "class-validator";

export class CreateMedicalRecordDto {
  @IsString()
  @IsNotEmpty()
  animalId: string;

  @IsString()
  @IsNotEmpty()
  farmerId: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsString()
  breed: string;

  @IsEnum(SEX)
  @IsNotEmpty()
  sex: SEX;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  color: string;

  @IsNumber()
  weight: number;

  @IsString()
  @IsNotEmpty()
  assessment: string;

  @IsString()
  @IsNotEmpty()
  treatment: string;

  @IsString()
  @IsNotEmpty()
  plan: string;
}
