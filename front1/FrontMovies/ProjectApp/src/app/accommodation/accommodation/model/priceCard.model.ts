import { PriceTypeEnum } from "src/app/models/enums/priceTypeEnum"
import { TimeSlot } from "./timeSlot.model"
export interface PriceCard{
    id?:number;
    timeSlot:TimeSlot;
    price:number;
    type:PriceTypeEnum;
}