import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccommodationService } from '../accommodation/accommodation.service';
import { AccommodationDataService } from '../accommodation/accommodation-data.service.module';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Accommodation } from '../accommodation/accommodation/model/accommodation.model';
import { UserGetDTO } from '../models/userGetDTO.model';
import { AuthService } from '../auth/auth.service';
import { RoleEnum } from '../models/userEnums.model';
import { ReservationService } from '../models/reservation/reservation.service';
import { ReservationPostDTO } from '../models/dtos/reservationPostDTO.model';
import { Reservation } from '../models/reservation/reservation.model';
import { UserService } from '../user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PriceCard } from '../accommodation/accommodation/model/priceCard.model';
import { TimeSlot } from '../accommodation/accommodation/model/timeSlot.model';
import { PriceTypeEnum } from '../models/enums/priceTypeEnum';
import { ReservationConfirmationEnum } from '../models/enums/reservationConfirmationEnum';
import { User } from '../models/user.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  standalone:true,
  imports:[MatFormFieldModule,ReactiveFormsModule,MatInputModule,MatDatepickerModule,MatButtonModule,CommonModule]
})
export class ReservationComponent {
  accommodation: Accommodation | undefined;
  user:User;
  role: RoleEnum ;
  reservation:Reservation | undefined;
  reservationToSend: ReservationPostDTO = {
    accommodationId:0,
    userId:"",
    timeSlot: {
      startDate: new Date(),
      endDate: new Date()
    },
    numberOfGuests: 0,
    price:0,
    priceType:0
  };

  constructor(private userService:UserService, private authService: AuthService,private accommodationService: AccommodationService, private snackBar:MatSnackBar, private fb: FormBuilder,
    private dataService: AccommodationDataService,private router: Router,
    private route:ActivatedRoute, private reservationService:ReservationService) {
      
  }
  reservationForm = this.fb.group({
    guests: [0, [Validators.pattern('^[0-9]+$'), Validators.min(1)]],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  }, { validators: this.dateValidator });
  ngOnInit() {
    this.authService.userState.subscribe((result) => {
      if(result != null){
        this.role = result.role;
        const accessToken: any = localStorage.getItem('user');
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(accessToken);
  
        if (decodedToken) {
        
        
        this.userService.getUserById(decodedToken.sub).subscribe(
          (user: User) => {
            if (user) {
              
              this.user=user;
              console.log(this.user)
            }
          });
  } else {
    console.error('Error decoding JWT token');
  }
      }else{
       this.role=RoleEnum.UNAUTHENTICATED;
      }
     // this.cdr.detectChanges();
    })
    if(this.route.paramMap)
    this.route.paramMap.subscribe((params: ParamMap) => {
      const accommodationId = +params.get('id')!;
      this.accommodationService.getById(accommodationId).subscribe(
        (foundAccommodation) => {
          if (foundAccommodation) {
            this.accommodation = foundAccommodation;
          } else {
            console.error(`Accommodation with ID ${accommodationId} not found`);
          }
        },
        (error) => {
          console.error('Error fetching accommodation:', error);
        }
      );
    });
  }

  formValidation():boolean{
    const guestsValue = this.reservationForm.get('guests')?.value;
    console.log(guestsValue);
    if (guestsValue!=undefined && isNaN(guestsValue)) {
      console.error('Please enter valid number for guests');
      this.openSnackBar('Please enter valid number for guests');
      return false;
    }else if(guestsValue!=undefined && guestsValue<=0)
      return false;

    return true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
  
  dateValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && startDate >= endDate) {
      formGroup.get('endDate')?.setErrors({ dateRange: true });
    } else {
      formGroup.get('endDate')?.setErrors(null);
    }

    if (startDate && endDate && startDate < new Date()) {
      formGroup.get('startDate')?.setErrors({ pastDate: true });
    } else {
      formGroup.get('startDate')?.setErrors(null);
    }

    if (endDate && endDate < new Date()) {
      formGroup.get('endDate')?.setErrors({ pastDate: true });
    } else {
      formGroup.get('endDate')?.setErrors(null);
    }

    return null;
  }

  checkPrice(){
    if(!this.formValidation()){
      return;
    }
    console.log(this.accommodation?.id);
    if(this.accommodation?.id){
      this.reservationToSend.accommodationId=this.accommodation.id;
    }
    this.reservationToSend.numberOfGuests=this.reservationForm.get('guests')?.value;
    this.reservationToSend.userId=this.user.username;
    console.log("USERNAME RES",this.user.username)
    this.reservationToSend.timeSlot.startDate=this.reservationForm.get('startDate')?.value;
    this.reservationToSend.timeSlot.endDate=this.reservationForm.get('endDate')?.value;

    if(this.accommodation)
      for(const p of this.accommodation?.prices){
        if(this.isWithinTimeSlot(this.reservationToSend.timeSlot.startDate,this.reservationToSend.timeSlot.endDate,p.timeSlot)){
          this.reservationToSend.price=p.price;
          this.reservationToSend.priceType=p.type;
        }
      }


    console.log(this.reservationToSend);
    if(this.reservationToSend){
      this.reservationService.create(this.reservationToSend)
    .subscribe(
      (reservation) => {
        this.reservation = reservation;
        this.reservation.user=this.user;
        console.log(this.reservation);
        const totalPrice=this.calculateTotalPrice(this.reservation);
        this.openSnackBar('Reservation request sent successfully. Total price would be '+totalPrice+'$');
        if(this.accommodation?.reservationConfirmation==ReservationConfirmationEnum.AUTOMATIC){
          // Confirm the reservation after creating it
          this.confirmReservation(reservation.id);
        }
      },
      (error) => {
        console.error('Error creating reservation:', error);
        if (error.error.error) {
          this.openSnackBar(error.error.error);
        } else {
          this.openSnackBar('An error occurred while creating the reservation. Check the number of guests and dates of your reservations');
        }

      }
    );
    }
  }

  confirmReservation(reservationId: number|undefined) {
    this.reservationService.confirmReservation(reservationId)
      .subscribe(
        () => {
          console.log('Reservation confirmed successfully.');
        },
        (error) => {
          console.error('Error confirming reservation:', error);
        }
      );
  }

  calculateTotalPrice(reservation:Reservation):number{
    if (!this.accommodation?.prices) {
      return 0;
    }
    for(const p of this.accommodation?.prices){
      if(this.isWithinTimeSlot(reservation.timeSlot.startDate,reservation.timeSlot.endDate,p.timeSlot)){
        const days=this.daysBetween(reservation.timeSlot.startDate,reservation.timeSlot.endDate);
        if(p.type==PriceTypeEnum.PERUNIT){
          return days*p.price;
        }
        else{
          return days*p.price*reservation.numberOfGuests;
        }
      }
    }
    return 0;
  }
  daysBetween(arrival:Date, checkout:Date):number{
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const arrivalTime = new Date(arrival).getTime();
    const checkoutTime = new Date(checkout).getTime();

    const timeDifference = checkoutTime - arrivalTime;
    const daysDifference = Math.round(timeDifference / oneDayMilliseconds);

    return daysDifference;
  }
  isWithinTimeSlot(arrival:Date, checkout:Date, timeSlot:TimeSlot):boolean{
    const arrivalTime = new Date(arrival).getTime();
    const checkoutTime = new Date(checkout).getTime();
    // Convert the string dates to Date objects
    const timeSlotStart = new Date(timeSlot.startDate).getTime();
    const timeSlotEnd = new Date(timeSlot.endDate).getTime();

    if (isNaN(timeSlotStart) || isNaN(timeSlotEnd)) {
      return false;
    }

    return !(arrivalTime < timeSlotStart || checkoutTime > timeSlotEnd);
  }
  get isFormValid(): boolean{
    return this.reservationForm.valid;
  }
  getTestableReservationService(){
    return this.reservationService;
  }
  goodDates(): boolean{
    const date1=this.reservationForm.get('startDate')?.value;
    const date2=this.reservationForm.get('endDate')?.value;
    return date1<date2;
  }
}
