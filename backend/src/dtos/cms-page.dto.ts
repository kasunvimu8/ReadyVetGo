import { CmsPageState, CmsPageType } from "@interfaces/cms.interface";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Exclude, Type } from "class-transformer";
import { Profile } from "@models/profile.model";

export class CreateCmsPageDto {
  @Exclude()
  private id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @MinLength(5)
  public relativeUrl: string;

  @IsString()
  @IsOptional()
  public thumbnailUrl?: string;

  @IsEnum(CmsPageType)
  public type: CmsPageType;

  @IsEnum(CmsPageState)
  public state: CmsPageState;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCmsComponentDto)
  public cmsComponents: CreateCmsComponentDto[];

  @Exclude()
  private lastEditedDate?: string;

  @Exclude()
  private createdBy?: Partial<Profile>;
}

export class CreateCmsComponentDto {
  @IsUUID()
  @IsOptional()
  public id?: string;

  @IsString()
  type: string;

  @IsNotEmpty()
  content: any;
}

export class UpdateCmsDto {
  @Exclude()
  private id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  public relativeUrl?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(CmsPageType)
  public type?: CmsPageType;

  @IsOptional()
  @IsEnum(CmsPageState)
  public state?: CmsPageState;

  @IsOptional()
  @IsString()
  public authorFeedback: string;

  @IsOptional()
  @IsBoolean()
  public hasAuthorReadFeedback: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCmsComponentDto)
  @IsOptional()
  public cmsComponents?: CreateCmsComponentDto[];

  @Exclude()
  private lastEditedDate?: string;

  @Exclude()
  private createdBy?: Partial<Profile>;
}
