import { Injectable } from "@angular/core";
import { Reservation } from "../models/reservation/reservation.model";
import { Accommodation } from "../accommodation/accommodation/model/accommodation.model";
import { AccommodationTypeEnum } from "../models/enums/accommodationTypeEnum";
import { TimeSlot } from "../accommodation/accommodation/model/timeSlot.model";
import { PriceTypeEnum } from "../models/enums/priceTypeEnum";
import { ReservationConfirmationEnum } from "../models/enums/reservationConfirmationEnum";
import { ReservationStatusEnum } from "../models/enums/reservationStatusEnum";
import { User } from "../models/user.model";
import { RoleEnum, StatusEnum } from "../models/userEnums.model";
import { Location } from "src/app/accommodation/accommodation/model/location.model";


@Injectable()
export class ReservationServiceMock{
    constructor(){}
    accommodationLocation: Location = {
        address: '123 Main Street',
        city: 'Cityville',
        country: 'Countryland',
        x: 40.7128,
        y: -74.0060
      };
      
      accommodation: Accommodation = {
        name: 'Sample Accommodation',
        description: 'A cozy place to stay',
        type: AccommodationTypeEnum.ROOM,
        location: this.accommodationLocation,
        minGuests: 1,
        maxGuests: 2,
        status: 'ACTIVE',
        images: ['image1.jpg', 'image2.jpg'],
        prices: [
          {
            timeSlot: {
              startDate: new Date('2024-02-01'),
              endDate: new Date('2024-02-15')
            },
            price: 100,
            type: PriceTypeEnum.PERGUEST
          },
        ],
        cancellationDeadline: 7,
        reservationConfirmation: ReservationConfirmationEnum.AUTOMATIC,
        assets: ['asset1.jpg', 'asset2.jpg'],
        ownerId: 'owner123',
        reviews: [],
      };
      
      timeSlot: TimeSlot = {
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-02-10')
      };
      
      user: User = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john.doe',
        password: 'password123',
        role: RoleEnum.GUEST,
        address: '456 Oak Street',
        phoneNumber: '123-456-7890',
        status: StatusEnum.ACTIVE,
        reservationRequestNotification: true,
        reservationCancellationNotification: true,
        ownerRatingNotification: true,
        accommodationRatingNotification: true,
        ownerRepliedToRequestNotification: true,
        deleted: false,
        token: 'abc123',
        jwt: 'xyz789',
        favouriteAccommodations: '1,2,3'
      };
      
      reservation: Reservation = {
        accommodation: this.accommodation,
        user: this.user,
        timeSlot: this.timeSlot,
        status: ReservationStatusEnum.PENDING,
        numberOfGuests: 2,
        price: 200,
        priceType: PriceTypeEnum.PERGUEST
      };
     getReservations(): Array<Reservation>{
         return [{
            accommodation: this.accommodation,
        user: this.user,
        timeSlot: this.timeSlot,
        status: ReservationStatusEnum.PENDING,
        numberOfGuests: 2,
        price: 200,
        priceType: PriceTypeEnum.PERGUEST
         }];
     }
}