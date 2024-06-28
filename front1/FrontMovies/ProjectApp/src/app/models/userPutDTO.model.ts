import { RoleEnum, StatusEnum } from "./userEnums.model";

export interface UserPutDTO {
    firstName: string;
    lastName: string;
    //username: string;
    password:string;
    passwordConfirmation:string;
    status:StatusEnum;
   // role: RoleEnum;
    address: string;
    phoneNumber: string;
    reservationRequestNotification:boolean,
    reservationCancellationNotification:boolean,
    ownerRatingNotification:boolean,
    accommodationRatingNotification:boolean,
    ownerRepliedToRequestNotification:boolean,
    deleted:boolean,
    token:string;
    favouriteAccommodations:string|undefined;
   // jwt:string
  }