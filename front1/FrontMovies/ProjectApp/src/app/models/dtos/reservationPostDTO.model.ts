import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
import { PriceTypeEnum } from "../enums/priceTypeEnum";
import { Accommodation } from "src/app/accommodation/accommodation/model/accommodation.model";
import { User } from "../user.model";

export interface ReservationPostDTO{
    accommodationId: number;
    userId: string;
    timeSlot: TimeSlot;
    numberOfGuests: number;
    price:number;
    priceType:PriceTypeEnum;
}