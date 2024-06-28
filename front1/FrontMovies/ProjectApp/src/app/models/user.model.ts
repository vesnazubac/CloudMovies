import { RoleEnum, StatusEnum } from "./userEnums.model";

export interface User {
    //id?: number;
    firstName: string;
    lastName: string;
    username: string;
    password:string;
    role: RoleEnum;
    address: string;
    phoneNumber: string;
    status: StatusEnum;
    reservationRequestNotification:boolean,
    reservationCancellationNotification:boolean,
    ownerRatingNotification:boolean,
    accommodationRatingNotification:boolean,
    ownerRepliedToRequestNotification:boolean,
    deleted:boolean;
    token:string;
    jwt:string;
    favouriteAccommodations:string;
  }