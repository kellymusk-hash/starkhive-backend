import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsUrl, MaxLength } from "class-validator"
import { Type } from "class-transformer"
import { PostPrivacy } from "../entities/post.entity"

class LinkMetadataDto {
  @IsUrl()
  url: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUrl()
  @IsOptional()
  image?: string
}

class PostImageDto {
  @IsUrl()
  url: string

  @IsString()
  @IsOptional()
  caption?: string

  @IsString()
  @IsOptional()
  altText?: string

  @IsOptional()
  order?: number
}

export class CreatePostDto {
  @IsString()
  @MaxLength(5000)
  content: string

  @IsEnum(PostPrivacy)
  @IsOptional()
  privacy?: PostPrivacy = PostPrivacy.PUBLIC

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  images?: PostImageDto[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkMetadataDto)
  links?: LinkMetadataDto[]

  @IsString({ each: true })
  @IsOptional()
  hashtags?: string[]

  @IsString()
  @IsOptional()
  originalPostId?: string
}

