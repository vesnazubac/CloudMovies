import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
import { ReservationStatusEnum } from "../enums/reservationStatusEnum";

export interface ReservationPutDTO{
    accommodationId: number;
    userId: string;
    timeSlot: TimeSlot;
    status: ReservationStatusEnum;
    numberOfGuests: number;
}