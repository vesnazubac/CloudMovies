import { Component, OnInit,ViewChild ,ChangeDetectorRef} from '@angular/core';
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
import { ReservationStatusEnum } from 'src/app/models/enums/reservationStatusEnum';
import { Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
interface ImageData {
  name: string;
  path: string;
}

@Component({
  selector: 'app-edit-accommodation',
  templateUrl: './edit-accommodation.component.html',
  styleUrls: ['./edit-accommodation.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatNativeDateModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,MatRadioModule,LayoutModule,MatTableModule, MatPaginatorModule,CommonModule,MatDatepickerModule,MatSnackBarModule],
})
export class EditAccommodationComponent  implements OnInit{

  AccommodationTypeEnum = AccommodationTypeEnum;
  ReservationConfirmationEnum=ReservationConfirmationEnum;
  accommodationTypeEnum=AccommodationTypeEnum;
  editedItem: PriceCard;
  selectedElement: PriceCard; 
  selectedFile:string
  images:string[]=[]
  imageDataList:ImageData[]=[]

  result:boolean=true;
  priceCards: PriceCard[];
  reservations:Reservation[]|undefined;
  accommodationId:number;    //accommodation id 
  accommodation:Accommodation;  //accommodation to be updated
  dataSource = new MatTableDataSource<PriceCard>([]);
  displayedColumns: string[] = ['Id', 'Start Date', 'End Date', 'Price','Type','actions'];

  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  ownerId:string=""

  editForm: FormGroup;

  imageDataSource = new MatTableDataSource<ImageData>();
  imageDisplayedColumns: string[] = ['Name', 'Image', 'Actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private route: ActivatedRoute,
    private router: Router,private snackBar:MatSnackBar,private cdr: ChangeDetectorRef,private fb:FormBuilder,private accommodationService:AccommodationService,private priceCardService:PriceCardService,private reservationService:ReservationService,private dialog:MatDialog) {
    this.editForm = this.fb.group({
      startDateEdit: [''],
      endDateEdit: [''],
      priceEdit: [''],
    });
  }
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      console.log('Selected File:', selectedFile.name);
      this.selectedFile="../../../assets/images/"+selectedFile.name
    }
  }
  addImage(){
    if (this.selectedFile) {
      
      const imageName = this.selectedFile.split('/').pop();
      const imageData: ImageData = { name: imageName || '', path: this.selectedFile };

      const imageIndex = this.images.findIndex(image => image === this.selectedFile);
  
      if (imageIndex !== -1) {
        this.openSnackBar("That picture already exists!")
        return;
      }

      this.images.push(this.selectedFile)
      this.imageDataList.push(imageData);


      this.imageDataSource = new MatTableDataSource<ImageData>(this.imageDataList);
      this.imageDataSource.paginator=this.paginator;
      this.imageDataSource.sort=this.sort

      console.log(this.images)
      console.log(this.accommodationId)
      console.log(this.selectedFile)
      this.accommodationService.updateImages(this.accommodationId, this.selectedFile).subscribe(
        (result) => {
          console.log('Images updated successfully:', result);
        },
        (error) => {
          console.error('Error updating images:', error);
        }
      );
    }
  }
  deleteImage(imageData: ImageData): void {
    const index = this.imageDataList.findIndex(img => img.path === imageData.path);
  
    if (index !== -1) {
      this.imageDataList.splice(index, 1);
    }
  
    const imageIndex = this.images.findIndex(image => image === imageData.path);
  
    if (imageIndex !== -1) {
      this.images.splice(imageIndex, 1);
    }
  
    // Update the image table data source
    this.imageDataSource = new MatTableDataSource<ImageData>(this.imageDataList);
    this.imageDataSource.paginator = this.paginator;
    this.imageDataSource.sort = this.sort;

    this.openSnackBar("Image deleted")
  }
  editAccommodationFormGroup=new FormGroup({
    name: new FormControl('',Validators.required),
    description:new FormControl('',Validators.required),
    address: new FormControl(),
    city:new FormControl(),
    country: new FormControl(),
    xCoordinate:new FormControl(),
    yCoordinate:new FormControl(),
    minGuests: new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$')]),
    maxGuests: new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$')]),
    cancellationDeadline:new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$')]),
    startDate:new FormControl(),
    endDate:new FormControl(),
    price:new FormControl(),
    priceType:new FormControl(),
    amenities:new FormControl(),
    type: new FormControl(),
    reservationConfirmation:new FormControl(),
    startDateEdit:new FormControl(),
    endDateEdit:new FormControl(),
    priceEdit:new FormControl(),
    priceCardId:new FormControl(),
 })
 
  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.accommodationId = +params.get('id')!;
    });

    this.ownerId=this.decodedToken.sub;

    this.accommodationService.getById(this.accommodationId)
    .subscribe(
      (response) => {
        this.accommodation = response as Accommodation;
        this.images=this.accommodation.images;
        console.log(this.images)
        this.editAccommodationFormGroup.get('name')?.setValue(this.accommodation?.name || '', { emitEvent: false });
        this.editAccommodationFormGroup.get('address')?.setValue(this.accommodation?.location?.address || '');
        this.editAccommodationFormGroup.get('country')?.setValue(this.accommodation?.location?.country || '');
        this.editAccommodationFormGroup.get('city')?.setValue(this.accommodation?.location?.city || '');
       //this.editAccommodationFormGroup.get('xCoordinate')?.setValue(this.accommodation?.location?.x || '');
        this.editAccommodationFormGroup.get('cancellationDeadline')?.setValue(this.accommodation?.cancellationDeadline || 0,{ emitEvent: false });
        //this.editAccommodationFormGroup.get('yCoordinate')?.setValue(this.accommodation?.location?.y || '');
        this.editAccommodationFormGroup.get('description')?.setValue(this.accommodation?.description || '');
        this.editAccommodationFormGroup.get('minGuests')?.setValue(this.accommodation?.minGuests || 0,{ emitEvent: false });
        this.editAccommodationFormGroup.get('maxGuests')?.setValue(this.accommodation?.maxGuests|| 0,{ emitEvent: false });

        this.setAmenitiesSelection();
        this.setReservationConfirmation();
        this.setType();
        this.priceCards=this.accommodation.prices;
        this.dataSource = new MatTableDataSource<PriceCard>(this.accommodation.prices);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        for(const image of this.images){
          const imageName = image.split('/').pop();
          const imageData: ImageData = { name: imageName || '', path: image };
          this.imageDataList.push(imageData);
        }
        console.log(this.imageDataList)
        this.imageDataSource = new MatTableDataSource<ImageData>(this.imageDataList);
        this.imageDataSource.paginator=this.paginator;
        this.imageDataSource.sort=this.sort
        //(click)="deleteImage(image)"

        this.reservationService.getByAccommodationId(this.accommodationId).subscribe(
          (reservations: Reservation[]|undefined) => {
            this.reservations = reservations;
            console.log(this.reservations);
          },
          (error) => {
            console.error('Error getting reservations for accommodation:', error);
          }
        );

        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);
      }  
    );

  }

  setAmenitiesSelection() {
    const amenitiesControl = this.editAccommodationFormGroup.get('amenities');
    if (amenitiesControl && this.accommodation?.assets) {
      amenitiesControl.setValue(this.accommodation.assets);
      }
  }
  setReservationConfirmation() {
    const reservationConfirmationControl = this.editAccommodationFormGroup.get('reservationConfirmation');
    if (reservationConfirmationControl && this.accommodation?.reservationConfirmation) {
      reservationConfirmationControl.setValue(this.accommodation.reservationConfirmation);
      }
  }
  setType() {
    const typeControl = this.editAccommodationFormGroup.get('type');
    if (typeControl && this.accommodation?.type) {
      typeControl.setValue(this.accommodation.type);
      }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 6000,
    });
  }

  validatePriceCardForm():boolean{
    if(this.editAccommodationFormGroup.value.startDate==null || this.editAccommodationFormGroup.value.endDate==null){
      this.openSnackBar('Missing date.');
      return false;
    }
    const startDate: Date = this.editAccommodationFormGroup.value.startDate;
    const endDate: Date = this.editAccommodationFormGroup.value.endDate;

    if (startDate >= endDate) {
      this.openSnackBar('Start date must be before end date.');
      return false;
    }

    const today = new Date();
    if (startDate <= today || endDate <= today) {
      this.openSnackBar('Selected dates must be in the future.');
      return false;
    }

    if (isNaN(this.editAccommodationFormGroup.get('price')?.value) || this.editAccommodationFormGroup.get('price')?.value==null) {
      this.openSnackBar('Price field is required number.');
      return false;
    }

    const priceTypeValue: PriceTypeEnum | undefined = this.editAccommodationFormGroup.get('priceType')?.value;

    if(priceTypeValue==undefined){
      this.openSnackBar('Type of price must be defined.');
      return false;
    }
    return true;
  }

  validatePriceCardAndReservations(newPriceCard:PriceCard):boolean{
    const newStartDate = new Date(newPriceCard.timeSlot.startDate);
    const newEndDate = new Date(newPriceCard.timeSlot.endDate);
  
    newStartDate.setHours(0, 0, 0, 0);
    newEndDate.setHours(0, 0, 0, 0);

    const overlap = this.reservations?.some(existingReservation => {
      console.log("EXISTING RES START DATE==> ", existingReservation.timeSlot.startDate)
      console.log("EXISTING RES END DATE==> ", existingReservation.timeSlot.endDate)
      const existingStartDate = new Date(existingReservation.timeSlot.startDate);
      const existingEndDate = new Date(existingReservation.timeSlot.endDate);
  
      existingStartDate.setHours(0, 0, 0, 0);
      existingEndDate.setHours(0, 0, 0, 0);

      console.log('Existing Reservation Start Date:', existingStartDate);
      console.log('Existing  End Date:', existingEndDate);
  
      const overlapStartDate = existingStartDate <= newEndDate && existingEndDate >= newStartDate;
      const overlapEndDate = existingEndDate >= newStartDate && existingStartDate <= newEndDate;
  
      return overlapStartDate && overlapEndDate;
      
    })
    return !overlap;
  }

  savePrice(){

    if(!this.validatePriceCardForm()){return;}

    let priceTypeValueEnum=PriceTypeEnum.PERUNIT
    const priceTypeValue: PriceTypeEnum | undefined = this.editAccommodationFormGroup.get('priceType')?.value;
    if(priceTypeValue==0){
      priceTypeValueEnum=PriceTypeEnum.PERGUEST
    }

    if (priceTypeValue !== undefined) {
        const newTimeSlot={
          startDate:this.editAccommodationFormGroup.value.startDate,
          endDate:this.editAccommodationFormGroup.value.endDate,
        }
        const newPriceCard = {
            timeSlot:newTimeSlot,
            price: this.editAccommodationFormGroup.value.price,
            type: priceTypeValueEnum,
            accommodationId:this.accommodationId
        };

        if (this.validatePriceCard(newPriceCard) && this.validatePriceCardAndReservations(newPriceCard)) {
          this.priceCardService.create(newPriceCard).subscribe(
            createdPriceCard => {
              this.priceCards.push(createdPriceCard);
              this.dataSource.data=this.priceCards;
              this.openSnackBar("Price card added!")
              return;
              
            },
            error => {
              console.error('Error during creating new object:', error);
              this.openSnackBar("Price for this timeslot is already defined and reservations are confirmed!")
            
          })
        } else {
          this.openSnackBar("Price for this timeslot is already defined and reservations are confirmed!")
        }
    } 
  }

  validatePriceCard(newPriceCard: PriceCardPostDTO|PriceCard): boolean { 

    const newStartDate = new Date(newPriceCard.timeSlot.startDate);
    const newEndDate = new Date(newPriceCard.timeSlot.endDate);
  
    newStartDate.setHours(0, 0, 0, 0);
    newEndDate.setHours(0, 0, 0, 0);
  
    const overlap = this.priceCards.some(existingPriceCard => {
      if(existingPriceCard.id!=newPriceCard.id){
      const existingStartDate = new Date(existingPriceCard.timeSlot.startDate);
      const existingEndDate = new Date(existingPriceCard.timeSlot.endDate);
  
      existingStartDate.setHours(0, 0, 0, 0);
      existingEndDate.setHours(0, 0, 0, 0);
  
      console.log('Existing Price Card Start Date:', existingStartDate);
      console.log('Existing Price Card End Date:', existingEndDate);
  
      const overlapStartDate = existingStartDate <= newEndDate && existingEndDate >= newStartDate;
      const overlapEndDate = existingEndDate >= newStartDate && existingStartDate <= newEndDate;
  
      console.log('Overlap Start Date:', overlapStartDate);
      console.log('Overlap End Date:', overlapEndDate);
  
      return overlapStartDate && overlapEndDate;
      }
      return false;
    });

    console.log('Overlap:', overlap);
    return !overlap;
  }
  
  onNameInput(event: any): void {
    this.editAccommodationFormGroup.get('name')?.setValue(event.target.value);
  }
  onDescriptionInput(event: any): void {
    this.editAccommodationFormGroup.get('description')?.setValue(event.target.value);
  }
  onMinGuestsInput(event: any): void {
    this.editAccommodationFormGroup.get('minGuests')?.setValue(event.target.value);
  }
  onMaxGuestsInput(event: any): void {
    this.editAccommodationFormGroup.get('maxGuests')?.setValue(event.target.value);
  }
  onCancellationDeadlineInput(event: any): void {
    this.editAccommodationFormGroup.get('cancellationDeadline')?.setValue(event.target.value);
  }
  onAddressInput(event: any): void {
    this.editAccommodationFormGroup.get('address')?.setValue(event.target.value);
  }
  onCountryInput(event: any): void {
    this.editAccommodationFormGroup.get('country')?.setValue(event.target.value);
  }
  onCityInput(event: any): void {
    this.editAccommodationFormGroup.get('city')?.setValue(event.target.value);
  }
  onXInput(event: any): void {
    this.editAccommodationFormGroup.get('xCoordinate')?.setValue(event.target.value);
  }
  onYInput(event: any): void {
    this.editAccommodationFormGroup.get('yCoordinate')?.setValue(event.target.value);
  }

  onAmenitiesInput(event: any): void {
    this.editAccommodationFormGroup.get('amenities')?.setValue(event.target.value);
  }
  onReservationConfirmationInput(event: any): void {
    this.editAccommodationFormGroup.get('reservationConfirmation')?.setValue(event.target.value);
  }
  onTypeInput(event: any): void {
    this.editAccommodationFormGroup.get('type')?.setValue(event.target.value);
  }

  openEditDialog(originalElement: PriceCard): void {

    const dialogRef = this.dialog.open(EditPriceCardDialogComponent, {
      width: '800px', 
      data: {element:JSON.parse(JSON.stringify(originalElement)) }, //Deep copy
    });

    dialogRef.afterClosed().subscribe((updatedElement: PriceCard | string) => {
      if(typeof(updatedElement)!='string' && updatedElement){
        if (updatedElement.timeSlot.startDate!=originalElement.timeSlot.startDate || updatedElement.timeSlot.endDate!=originalElement.timeSlot.endDate) {  //nije zamenjen vec postojeci tj.postoji korekcija intervala a ne samo cene
          if (this.validatePriceCard(updatedElement) && this.validatePriceCardAndReservations(updatedElement)){
            this.updatePriceCard(updatedElement);
          }
          else{
            this.openSnackBar("Price for this timeslot is already defined and reservations are confirmed!")
            return;
          }
        }
        this.updatePriceCard(updatedElement);
    }
    });
}

updatePriceCard(updatedElement: PriceCard): void {

  const newPriceCard = {
    //id:updatedElement.id,
    timeSlot:updatedElement.timeSlot,
    price: updatedElement.price,
    type: updatedElement.type,
    accommodationId:this.accommodationId
};
  if(updatedElement.id==undefined){return;}
  this.priceCardService.update(newPriceCard,updatedElement.id).subscribe(
    updatedPriceCard => {
      const index = this.priceCards.findIndex((element) => element.id === updatedPriceCard.id);

      if (index !== -1) {
        this.priceCards[index] = updatedElement;
      }
      this.dataSource.data=this.priceCards;
      this.openSnackBar('Price card is updated...');
      
    },
    error => {
      console.error('Error during updating object:', error);
    
  });
}
  
  deleteItem(element: any) {
    this.priceCardService.delete(element.id).subscribe({});
    console.log('Delete item:', element);
    const index = this.priceCards.indexOf(element);
    if (index !== -1) {
      this.priceCards.splice(index, 1);
    }
    this.dataSource.data=this.priceCards;
  }

  formValidation():boolean{
    if (this.editAccommodationFormGroup.get('name')?.value === '') {
      console.error('Accommodation name is required.');
      this.openSnackBar('Accommodation name is required.');
      return false;
    }
    
    if (this.editAccommodationFormGroup.get('type')?.value === null || this.editAccommodationFormGroup.get('type')?.value === undefined) {
      console.error('Please select a type of accommodation.');
      this.openSnackBar('Please select a type of accommodation.');
      return false;
    }
    if (this.editAccommodationFormGroup.get('description')?.value === '') {
      console.error('Description is required.');
      this.openSnackBar('Description is required.');
      return false;
    }

    if (this.editAccommodationFormGroup.get('country')?.value === '') {
      console.error('Country is required.');
      this.openSnackBar('Country is required.');
      return false;
    }
    if (this.editAccommodationFormGroup.get('city')?.value === '') {
      console.error('City is required.');
      this.openSnackBar('City is required.');
      return false;
    }
    if (this.editAccommodationFormGroup.get('address')?.value === '') {
      console.error('Address is required.');
      this.openSnackBar('Adress is required.');
      return false;
    }

    const cancellationDeadlineValue2 = this.editAccommodationFormGroup.get('cancellationDeadline')?.value;



    if (this.editAccommodationFormGroup.get('cancellationDeadline')?.value ==0) {
      console.error('Cancellation deadline can not be zero.');
      this.openSnackBar('Cancellation deadline can not be zero or empty');
      return false;
    }
    const cancellationDeadlineValue1 = this.editAccommodationFormGroup.get('cancellationDeadline')?.value;

if (cancellationDeadlineValue1 !== undefined && cancellationDeadlineValue1 !== null) {
  if (cancellationDeadlineValue1 < 0) {
    console.error('Cancellation deadline can not be zero.');
    this.openSnackBar('Cancellation deadline can not be negative.');
    return false;
  }
}


    const minGuestsValue = this.editAccommodationFormGroup.get('minGuests')?.value;
    const maxGuestsValue = this.editAccommodationFormGroup.get('maxGuests')?.value;
    const cancellationDeadlineValue = this.editAccommodationFormGroup.get('cancellationDeadline')?.value;

    if ((minGuestsValue!=undefined && isNaN(minGuestsValue)) || (maxGuestsValue!=undefined && isNaN(maxGuestsValue)) ||(cancellationDeadlineValue!=undefined && isNaN(cancellationDeadlineValue))) {
      console.error('Please enter valid numbers for minGuests, maxGuests, and cancellationDeadline.');
      this.openSnackBar('Please enter valid numbers for minGuests, maxGuests, and cancellationDeadline.');
      return false;
    }

    if ((minGuestsValue!=undefined && !isNaN(minGuestsValue)) || (maxGuestsValue!=undefined && !isNaN(maxGuestsValue))) {
      if(minGuestsValue!=null && maxGuestsValue!=null && minGuestsValue>maxGuestsValue){
        this.openSnackBar('Max num of guests must be above min number of guests.');
        return false;
      }
    }

    console.log(this.editAccommodationFormGroup.get('reservationConfirmation')?.value)

    if (this.editAccommodationFormGroup.get('reservationConfirmation')?.value === null || this.editAccommodationFormGroup.get('reservationConfirmation')?.value == undefined) {
      console.error('Please select a type of reservation confirmation.');
      this.openSnackBar('Please select a type of reservation confirmation.');
      return false;
    }

    this.reservationService
  .getByAccommodationId(this.accommodationId)
  .subscribe((reservations) => {
    this.reservations = reservations;
    
    if (this.reservations) {
      for (let i = 0; i < this.reservations.length; i++) {
        const reservation = this.reservations[i];
        
        if (
          reservation.status === ReservationStatusEnum.APPROVED ||
          reservation.status === ReservationStatusEnum.INPROCESS ||
          reservation.status === ReservationStatusEnum.PENDING
        ) {
          if (this.isFutureDate(reservation.timeSlot.startDate)) {
            this.openSnackBar("Can't update accommodation data - there are existing reservations...");
            this.result = false;
            break; // Izlazimo iz petlje
          }
        }
      }
    }
  });
    return true;
  }

  isFutureDate(date:Date): boolean {
    const today = new Date();
    return date > today;
  }

  saveChanges(){

    if(!this.formValidation()){return;}

      const updatedAccommodation: AccommodationPutDTO = {
        name: this.editAccommodationFormGroup.value.name,
        description: this.editAccommodationFormGroup.value.description,
        location: {
          address: this.editAccommodationFormGroup.value.address,
          city: this.editAccommodationFormGroup.value.city,
          country: this.editAccommodationFormGroup.value.country,
          x: this.accommodation.location.x,
          y: this.accommodation.location.y
        },
        minGuests: this.editAccommodationFormGroup.value.minGuests,
        maxGuests: this.editAccommodationFormGroup.value.maxGuests,
        type:this.editAccommodationFormGroup.get('type')?.value,
       // type: (this.editAccommodationFormGroup.value.type !== null && this.editAccommodationFormGroup.value.type !== undefined) ? this.editAccommodationFormGroup.value.type as AccommodationTypeEnum : null,
        assets: this.editAccommodationFormGroup.get('amenities')?.value,
        //prices: this.priceCards,
        ownerId:this.ownerId,
        reservationConfirmation:this.editAccommodationFormGroup.get('reservationConfirmation')?.value,
        // reservationConfirmation:(this.editAccommodationFormGroup.value.reservationConfirmation !== null && this.editAccommodationFormGroup.value.reservationConfirmation !== undefined) ? this.editAccommodationFormGroup.value.reservationConfirmation as ReservationConfirmationEnum : null,
        cancellationDeadline: this.editAccommodationFormGroup.value.cancellationDeadline,
        images: this.images
      };
      this.accommodationService.update(updatedAccommodation,this.accommodationId).subscribe({ });
      this.openSnackBar('Sucessfully created request for change!');
      } 

  delete() {
    if (this.accommodation.id !== undefined) {
      this.accommodationService.delete(this.accommodation.id).subscribe({
      });
    } else {
      console.error('Accommodation id is undefined');
    }
  }

}


