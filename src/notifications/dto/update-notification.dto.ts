import { IsBoolean, IsOptional } from "class-validator";
import { CreateNotificationDto } from "./create-notification.dto";
import { PartialType } from '@nestjs/mapped-types';
export class UpdateNotificationDto extends PartialType(CreateNotificationDto){
    @IsOptional()
    @IsBoolean()
    read?:boolean
}