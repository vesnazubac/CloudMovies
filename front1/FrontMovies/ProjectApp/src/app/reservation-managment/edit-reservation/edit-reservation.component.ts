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
import { ReservationPutDTO } from 'src/app/models/dtos/reservationPutDTO.model';
import { ReservationStatusEnum } from 'src/app/models/enums/reservationStatusEnum';
import { MatRadioModule } from '@angular/material/radio';
import { Reservation } from 'src/app/models/reservation/reservation.model';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css'],
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,LayoutModule,ReactiveFormsModule,MatRadioModule, MatDatepickerModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatButtonModule],
  
})
export class EditReservationComponent {
  constructor(private reservationService:ReservationService){}
  reservationId:number=1//test
  userId:string='LUKA'//userId will also be taken from URL
  accommodationId:number=4//accommodationId will be taken from URL to simplify
  reservation:Reservation
  editReservationForm=new FormGroup({
    accommodationId:new FormControl(),
    userId: new FormControl(),
    startDate:new FormControl(),
    endDate:new FormControl(),
    reservationStatus:new FormControl(),
    numberOfGuests:new FormControl()
  })

  ngOnInit(): void{
    this.reservationService.getById(this.reservationId).subscribe(
      (response) => {
        this.reservation=response as Reservation;
        console.log(this.reservation);

        this.editReservationForm.get('accommodationId')?.setValue(this.accommodationId || '');
        this.editReservationForm.get('userId')?.setValue(this.userId || '');
        this.editReservationForm.get('numberOfGuests')?.setValue(this.reservation?.numberOfGuests);
        this.editReservationForm.get('startDate')?.setValue(this.reservation?.timeSlot.startDate || '');
        this.editReservationForm.get('endDate')?.setValue(this.reservation?.timeSlot.endDate || '');
        this.editReservationForm.get('reservationStatus')?.setValue(this.reservation?.status || '');
      },(error) =>{
        console.error(error);
      }
    );
  }
  saveChanges(){
    const statusValue: string | undefined=this.editReservationForm.get('reservationStatus')?.value;
    const statusEnum:ReservationStatusEnum=ReservationStatusEnum[statusValue as keyof typeof ReservationStatusEnum];
    const updatedReservation: ReservationPutDTO={
      accommodationId:this.editReservationForm.value.accommodationId,
      userId:this.editReservationForm.value.userId,
      timeSlot:{
        startDate:this.editReservationForm.value.startDate,
        endDate:this.editReservationForm.value.endDate,
      },
      status:statusEnum,
      numberOfGuests:Number(this.editReservationForm.value.numberOfGuests)
    };
    console.log(updatedReservation);
    this.reservationService.update(updatedReservation,this.reservationId).subscribe({});
  }
}
