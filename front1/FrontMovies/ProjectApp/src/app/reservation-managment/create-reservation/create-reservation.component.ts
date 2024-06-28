import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from 'src/app/layout/layout.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservationPostDTO } from 'src/app/models/dtos/reservationPostDTO.model';
import { TimeSlotEnum } from 'src/app/models/enums/timeSlotEnum';
import { ReservationService } from 'src/app/models/reservation/reservation.service';
@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.css'],
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,LayoutModule,ReactiveFormsModule,MatDatepickerModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatButtonModule],
  
})
export class CreateReservationComponent {

  constructor(private reservationService:ReservationService){}

  createReservationForm=new FormGroup({
    accommodationId:new FormControl(),
    userId: new FormControl(),
    startDate:new FormControl(),
    endDate:new FormControl(),
    numberOfGuests:new FormControl()
  })

  register(){
    const reservation: ReservationPostDTO={
      accommodationId:0,
      userId:"",
      timeSlot:{
        startDate:this.createReservationForm.value.startDate,
        endDate:this.createReservationForm.value.endDate,
      },
      numberOfGuests:this.createReservationForm.value.numberOfGuests,
      price:0,
      priceType:0
    };
    
    console.log(reservation);
    this.reservationService.create(reservation).subscribe({});
  }
}
