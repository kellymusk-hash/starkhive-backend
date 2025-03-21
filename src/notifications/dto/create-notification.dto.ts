import { IsInt, IsString } from "class-validator";

export class CreateNotificationDto{
    @IsInt()
    userId:number

    @IsString()
    type: string;

    @IsString()
    message: string;
}