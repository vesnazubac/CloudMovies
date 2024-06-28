import { PriceTypeEnum } from "src/app/models/enums/priceTypeEnum"
import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
export interface PriceCardPutDTO{
    //id?:number;
    timeSlot:TimeSlot;
    price:number;
    type:PriceTypeEnum;
    accommodationId:number | undefined;
}