import { Accommodation } from "./accommodation.model";

export interface AccommodationDetails{
    accommodation: Accommodation,
    totalPrice: number,
    unitPrice: number,
    averageRating: number
}