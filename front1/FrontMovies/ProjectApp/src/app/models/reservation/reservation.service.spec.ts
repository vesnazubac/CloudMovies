import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ReservationService } from "./reservation.service"
import { ReservationServiceMock } from "src/app/mocks/reservation.mock.service";
import { TestBed } from "@angular/core/testing";
import { ReservationPostDTO } from "../dtos/reservationPostDTO.model";
import { PriceTypeEnum } from "../enums/priceTypeEnum";
import { Reservation } from "./reservation.model";
import { ReservationStatusEnum } from "../enums/reservationStatusEnum";
import { Accommodation } from "src/app/accommodation/accommodation/model/accommodation.model";
import { TimeSlot } from "src/app/accommodation/accommodation/model/timeSlot.model";
import { AccommodationTypeEnum } from "../enums/accommodationTypeEnum";
import { ReservationConfirmationEnum } from "../enums/reservationConfirmationEnum";
import { User } from "../user.model";
import { RoleEnum, StatusEnum } from "../userEnums.model";
import { environment } from 'src/env/env';
import { Location } from "src/app/accommodation/accommodation/model/location.model";
//import { User } from './models/user.model';

describe('ReservationService', ()=>{
    let reservationService: ReservationService;
    let httpTestingController: HttpTestingController;
    let reservationServiceMock: ReservationServiceMock;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[ReservationService,
            ReservationServiceMock]
        });
        reservationService=TestBed.inject(ReservationService);
        httpTestingController=TestBed.inject(HttpTestingController);
        reservationServiceMock=TestBed.inject(ReservationServiceMock);
    });

    afterEach(()=>{
        httpTestingController.verify();
    });

    it('should be created',()=>{
        expect(reservationService).toBeTruthy();
    });
    
    it('should create reservation',()=>{
        const newReservation: ReservationPostDTO={
            accommodationId:1,
            userId:'john.doe',
            timeSlot:{
                startDate: new Date(),
                endDate: new Date()
            },
            numberOfGuests:3,
            price: 500,
            priceType:PriceTypeEnum.PERUNIT
        };

        const accommodationLocation: Location = {
            address: '123 Main Street',
            city: 'Cityville',
            country: 'Countryland',
            x: 40.7128,
            y: -74.0060
          };
          
          const accommodation: Accommodation = {
            name: 'Sample Accommodation',
            description: 'A cozy place to stay',
            type: AccommodationTypeEnum.ROOM,
            location: accommodationLocation,
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
          
          const timeSlot: TimeSlot = {
            startDate: new Date('2024-02-05'),
            endDate: new Date('2024-02-10')
          };
          
          const user: User = {
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
          
          const reservation: Reservation = {
            accommodation: accommodation,
            user: user,
            timeSlot: timeSlot,
            status: ReservationStatusEnum.PENDING,
            numberOfGuests: 2,
            price: 200,
            priceType: PriceTypeEnum.PERGUEST
          };

        //   const createdReservationPost: ReservationPostDTO={
        //     ...newReservation,
        //   };

        reservationService.create(newReservation).subscribe(createdReservation =>{
            expect(createdReservation).toEqual(reservation);
        });

        const req=httpTestingController.expectOne(`${environment.apiHost}reservations`);
        expect(req.request.method).toEqual('POST');
        req.flush(reservation);
    });
});