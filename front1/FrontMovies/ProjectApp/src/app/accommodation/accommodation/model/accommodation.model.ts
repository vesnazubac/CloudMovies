import { PriceCard } from "./priceCard.model";
import { TimeSlot } from "./timeSlot.model";
import { AccommodationTypeEnum } from "src/app/models/enums/accommodationTypeEnum";
import { Location } from "src/app/accommodation/accommodation/model/location.model";
import { ReservationConfirmationEnum } from "src/app/models/enums/reservationConfirmationEnum";
import { Review } from "./review.model";
export interface Accommodation{
    id?: number;
    name: string;
    description: string;
    type:AccommodationTypeEnum;
    location:Location
    minGuests: number;
    maxGuests: number;
    status: string;
    images:string[];
    prices:PriceCard[];
    cancellationDeadline:number;
    reservationConfirmation:ReservationConfirmationEnum;
    assets:string[];
    ownerId:string;
    reviews :Review[];
}