import { PriceCard } from "src/app/accommodation/accommodation/model/priceCard.model";
import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
import { AccommodationTypeEnum } from "../enums/accommodationTypeEnum";
import { Location } from "src/app/accommodation/accommodation/model/location.model";

export interface AccommodationPostDTO {
    name: string | null|undefined;
    description: string | null|undefined;
    location:Location;
    minGuests: number |null|undefined;
    maxGuests: number |null|undefined;
    type:AccommodationTypeEnum | null;
    assets:String[];
    //prices:PriceCard[];
    ownerId:String;
    cancellationDeadline:number |null|undefined;
    images:string[];
  }