import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
import { ReservationStatusEnum } from "../enums/reservationStatusEnum";
import { PriceTypeEnum } from "../enums/priceTypeEnum";
import { Accommodation } from "src/app/accommodation/accommodation/model/accommodation.model";
import { User } from "../user.model";

export interface Reservation{
    id?: number;
    accommodation: Accommodation;
    user: User;
    timeSlot:TimeSlot;
    status:ReservationStatusEnum;
    numberOfGuests:number;
    price:number;
    priceType:PriceTypeEnum;
}