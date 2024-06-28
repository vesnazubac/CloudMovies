import { Component, Inject,OnInit,ViewChild ,ChangeDetectorRef} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import { LayoutModule } from 'src/app/layout/layout.module';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { PriceCard } from 'src/app/accommodation/accommodation/model/priceCard.model';
import { CommonModule } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PriceTypeEnum } from 'src/app/models/enums/priceTypeEnum';
import { FormControl ,Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AccommodationTypeEnum } from 'src/app/models/enums/accommodationTypeEnum';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { ReservationConfirmationEnum } from 'src/app/models/enums/reservationConfirmationEnum';
import { AccommodationPutDTO } from 'src/app/models/dtos/accommodationPutDTO.model';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditPriceCardDialogComponent } from '../edit-price-card-dialog/edit-price-card-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceCardService } from 'src/app/accommodation/priceCard.service';
import { Reservation } from 'src/app/models/reservation/reservation.model';
import { ReservationService } from 'src/app/models/reservation/reservation.service';
import { PriceCardPostDTO } from 'src/app/models/dtos/priceCardPostDTO.model';
import { AccommodationStatusEnum } from 'src/app/models/enums/accommodationStatusEnum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccommodationRequestService } from '../accommodationRequestService';
import { AccommodationRequestStatus } from 'src/app/models/enums/accommodationRequestStatus';
@Component({
  selector: 'app-accommodation-review-dialog',
  templateUrl: './accommodation-review-dialog.component.html',
  styleUrls: ['./accommodation-review-dialog.component.css'],
  standalone:true,
  imports: [MatPaginatorModule,ReactiveFormsModule,MatFormFieldModule,MatNativeDateModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,MatRadioModule,LayoutModule,MatTableModule, MatPaginatorModule,CommonModule,MatDatepickerModule,MatSnackBarModule],

})
export class AccommodationReviewDialogComponent implements OnInit{

  requestId:number;
  element:Accommodation;
  originalAccommodation:Accommodation|undefined;
  originalAccommodationId:number|undefined;
  form:FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  dataSource = new MatTableDataSource<PriceCard>([]);

  constructor(private snackBar:MatSnackBar,public dialogRef: MatDialogRef<AccommodationReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element:Accommodation,requestId:number},
    private fb: FormBuilder,private accommodationService:AccommodationService,private requestsService:AccommodationRequestService
  ) {  }

  displayedColumns: string[] = ['Id', 'Start Date', 'End Date', 'Type'];

  ngOnInit(): void {
    this.form = this.fb.group({
      amenities: [null]
    });

    this.requestId=this.data.requestId;

    this.requestsService.getById(this.requestId).subscribe(
      (response) => {
        console.log(response)
        if(response?.originalAccommodationId==null){
          console.log("udjee u 78jeste null")
          this.originalAccommodationId=response?.unapprovedAccommodationId;
        }
        else{
          console.log("udjee u 82 nije null")
        this.originalAccommodationId=response?.originalAccommodationId;
        console.log(this.originalAccommodationId)
        }

        if(this.originalAccommodationId!=undefined){
          console.log("usaoooooo")
        this.accommodationService.getById(this.originalAccommodationId).subscribe(
          (response) => {
            this.originalAccommodation=response;
             
            this.element = this.data.element;
            console.log(this.requestId);
            console.log(this.originalAccommodation)
            this.setAmenitiesSelection();
            if (this.element && this.originalAccommodation?.prices != null) {
              console.log("usaoooooo")
              this.dataSource = new MatTableDataSource<PriceCard>(this.originalAccommodation.prices);
            }
          },
          (error) => {
            // Obrada greške
            console.error(error);
          }
        );
        }

      },
      (error) => {
        // Obrada greške
        console.error(error);
      }
    );
    
    // if(this.originalAccommodationId!=undefined){
    //   console.log("usaoooooo")
    // this.accommodationService.getById(this.originalAccommodationId).subscribe(
    //   (response) => {
    //     this.originalAccommodation=response;
    //   },
    //   (error) => {
    //     // Obrada greške
    //     console.error(error);
    //   }
    // );
    

    
    // this.element = this.data.element;
    // console.log(this.requestId);
    // console.log(this.originalAccommodation)
    // this.setAmenitiesSelection();
    // if (this.element && this.originalAccommodation?.prices != null) {
    //   console.log("usaoooooo")
    //   this.dataSource = new MatTableDataSource<PriceCard>(this.originalAccommodation.prices);
    // }

  }

  ngAfterViewInit(): void {  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setAmenitiesSelection() {
    const amenitiesControl = this.form.get('amenities');
    if (amenitiesControl && this.element?.assets) {
      amenitiesControl.setValue(this.element.assets);
      }
  }


  approve(){
    if(this.element.id!=null){
    this.requestsService.updateStatus(this.requestId,AccommodationRequestStatus.APPROVED).subscribe(
      (response) => {
        console.log('Server response:', response);
      },
      (error) => {
        console.error('Error from server:', error);
      }
    );}
    this.dialogRef.close('cancel');
  }

  reject(){
    if(this.element.id!=null){
      this.requestsService.updateStatus(this.requestId,AccommodationRequestStatus.REJECTED).subscribe(
        (response) => {
          console.log('Server response:', response);
        },
        (error) => {
          console.error('Error from server:', error);
        }
      );}
      this.dialogRef.close('cancel');
  }



}
