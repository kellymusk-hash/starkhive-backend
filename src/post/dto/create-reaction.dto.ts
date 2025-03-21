import { IsEnum } from "class-validator"
import { ReactionType } from "../entities/post-reaction.entity"

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType
}

