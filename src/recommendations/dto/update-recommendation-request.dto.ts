import { IsEnum, IsOptional } from "class-validator"
import { RequestStatus } from "../entities/recommendation-request.entity"

export class UpdateRecommendationRequestDto {
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus
}

