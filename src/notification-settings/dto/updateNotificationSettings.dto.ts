import { PartialType } from "@nestjs/mapped-types";
import { CreateNotificationSettingsDto } from "./createNotificationSettings.dto";

export class UpdateNotificationSettingsDto extends PartialType(CreateNotificationSettingsDto){
    
}