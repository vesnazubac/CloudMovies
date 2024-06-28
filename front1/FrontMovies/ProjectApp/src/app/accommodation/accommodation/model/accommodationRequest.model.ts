import { AccommodationRequestStatus } from "src/app/models/enums/accommodationRequestStatus";
export interface AccommodationRequest{
    id:number;
    unapprovedAccommodationId:number;
    requestStatus:AccommodationRequestStatus;
    originalAccommodationId:number;
}
