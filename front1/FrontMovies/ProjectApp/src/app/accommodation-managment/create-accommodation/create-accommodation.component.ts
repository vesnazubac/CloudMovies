import { Component,ViewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import { LayoutModule } from 'src/app/layout/layout.module';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { AccommodationTypeEnum } from 'src/app/models/enums/accommodationTypeEnum';
import { AccommodationPostDTO } from 'src/app/models/dtos/accommodationPostDTO.model';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PriceCard } from 'src/app/accommodation/accommodation/model/priceCard.model';
import { PriceTypeEnum } from 'src/app/models/enums/priceTypeEnum';
import { TimeSlotEnum } from 'src/app/models/enums/timeSlotEnum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PriceCardService } from 'src/app/accommodation/priceCard.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
interface ImageData {
  name: string;
  path: string;
}
@Component({
  selector: 'app-create-accommodation',
  templateUrl: './create-accommodation.component.html',
  styleUrls: ['./create-accommodation.component.css'],
  standalone: true,
  imports: [CommonModule,MatTableModule,MatPaginatorModule,MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule,MatChipsModule,MatRadioModule,LayoutModule,ReactiveFormsModule,MatDatepickerModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatButtonModule,MatSnackBarModule],
})
export class CreateAccommodationComponent {

  prices:PriceCard[]
  images:string[]=[]
  accommodationTypeEnum = AccommodationTypeEnum;

  imageDataList:ImageData[]=[]
  imageDataSource = new MatTableDataSource<ImageData>();
  imageDisplayedColumns: string[] = ['Name', 'Image', 'Actions'];

  dataSource = new MatTableDataSource<PriceCard>([]);
  displayedColumns: string[] = ['Id', 'Start Date', 'End Date', 'Price','Type'];

  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  ownerId:string=""
  selectedFile:string

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private accommodationService:AccommodationService,private snackBar:MatSnackBar,private priceCardService:PriceCardService) {}

  ngOnInit() {
    this.ownerId=this.decodedToken.sub;
     this.prices = [];
     this.dataSource = new MatTableDataSource<PriceCard>(this.prices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    this.imageDataSource=new MatTableDataSource<ImageData>(this.imageDataList);
    this.imageDataSource.paginator=this.paginator;
    this.imageDataSource.sort=this.sort;
  }

  createAccommodationForm=new FormGroup({
    name: new FormControl('',Validators.required),
    address:new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    xCoordinate: new FormControl(),
    yCoordinate: new FormControl(),
    type: new FormControl(null, Validators.required),
    minGuests:new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(0)]),
    maxGuests:new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(0)]),
    cancellationDeadline: new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$'),Validators.min(0)]),
    description:new FormControl('',Validators.required),
    amenities: new FormControl(),
    ownerId:new FormControl(),
    startDate:new FormControl(),
    endDate:new FormControl(),
    price:new FormControl(),
    priceType:new FormControl(),
    image:new FormControl(),
  })

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
  validatePriceCardForm():boolean{
    const startDate: Date = this.createAccommodationForm.value.startDate;
    const endDate: Date = this.createAccommodationForm.value.endDate;

    if(this.createAccommodationForm.value.startDate==null || this.createAccommodationForm.value.endDate==null){
      this.openSnackBar('Missing date.');
      return false;
    }

    if (startDate >= endDate) {
      this.openSnackBar('Start date must be before end date.');
      return false;
    }

    const today = new Date();
    if (startDate <= today || endDate <= today) {
      this.openSnackBar('Selected dates must be in the future.');
      return false;
    }

    if (isNaN(this.createAccommodationForm.get('price')?.value) || this.createAccommodationForm.get('price')?.value==null) {
      this.openSnackBar('Price field is required number.');
      return false;
    }

    const priceTypeValue: PriceTypeEnum | undefined = this.createAccommodationForm.get('priceType')?.value;

    if(priceTypeValue==undefined){
      this.openSnackBar('Type of price must be defined.');
      return false;
    }
    return true;
  }

  validatePriceCard(newPriceCard: PriceCard): boolean { 

    const newStartDate = new Date(newPriceCard.timeSlot.startDate);
    const newEndDate = new Date(newPriceCard.timeSlot.endDate);
  
    newStartDate.setHours(0, 0, 0, 0);
    newEndDate.setHours(0, 0, 0, 0);
  
    const overlap = this.prices.some(existingPriceCard => {
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
    });

    console.log('Overlap:', overlap);
    return !overlap;
  }


  savePrice(){
    if(!this.validatePriceCardForm()){return;}
    let priceTypeValueEnum=PriceTypeEnum.PERUNIT
    const priceTypeValue: PriceTypeEnum | undefined = this.createAccommodationForm.get('priceType')?.value;
    if(priceTypeValue==0){
      priceTypeValueEnum=PriceTypeEnum.PERGUEST
    }
    if (priceTypeValue !== undefined) {
        const newTimeSlot={
          startDate:this.createAccommodationForm.value.startDate,
          endDate:this.createAccommodationForm.value.endDate,
        }
        const newPriceCard = {
            timeSlot:newTimeSlot,
            price: this.createAccommodationForm.value.price,
            type: priceTypeValueEnum,
        };
        if (this.validatePriceCard(newPriceCard)) {
          this.prices.push(newPriceCard);
          this.dataSource.data=this.prices;
        } else {
          this.openSnackBar("Price for this timeslot is already defined!")
        }
      
      }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  getTypeString(type: number): string {
    switch (type) {
      case 0:
        return 'PERGUEST';
      default:
        return 'PERUNIT';
    }
  }

  formValidation():boolean{
    if (this.createAccommodationForm.get('name')?.value === '') {
      console.error('Accommodation name is required.');
      this.openSnackBar('Accommodation name is required.');
      return false;
    }
    if (this.createAccommodationForm.get('type')?.value === null) {
      console.error('Please select a type of accommodation.');
      this.openSnackBar('Please select a type of accommodation.');
      return false;
    }
    if (this.createAccommodationForm.get('description')?.value === '') {
      console.error('Description is required.');
      this.openSnackBar('Description is required.');
      return false;
      }
    const minGuestsValue = this.createAccommodationForm.get('minGuests')?.value;
    const maxGuestsValue = this.createAccommodationForm.get('maxGuests')?.value;
    const cancellationDeadlineValue = this.createAccommodationForm.get('cancellationDeadline')?.value;

    if ((minGuestsValue!=undefined && isNaN(minGuestsValue)) || (maxGuestsValue!=undefined && isNaN(maxGuestsValue)) ||(cancellationDeadlineValue!=undefined && isNaN(cancellationDeadlineValue))) {
      console.error('Please enter valid numbers for minGuests, maxGuests, and cancellationDeadline.');
      this.openSnackBar('Please enter valid numbers for minGuests, maxGuests, and cancellationDeadline.');
      return false;
    }

    if (this.createAccommodationForm.get('address')?.value === '') {
      console.error('Address is required.');
      this.openSnackBar('Address is required.');
      return false;
      }
    
    if (this.createAccommodationForm.get('country')?.value === '') {
      console.error('Country is required.');
      this.openSnackBar('Country is required.');
      return false;
    }

    if (this.createAccommodationForm.get('city')?.value === '') {
      console.error('City is required.');
      this.openSnackBar('City is required.');
      return false;
    }

    if ((minGuestsValue!=undefined && !isNaN(minGuestsValue)) || (maxGuestsValue!=undefined && !isNaN(maxGuestsValue))) {
      if(minGuestsValue!=null && maxGuestsValue!=null && minGuestsValue>maxGuestsValue){
        this.openSnackBar('Max num of guests must be above min number of guests.');
        return false;
      }
    }
    return true;
  }




register(){

  if(!this.formValidation()){return;}
    const accommodation: AccommodationPostDTO = {
      name: this.createAccommodationForm.value.name,
      description: this.createAccommodationForm.value.description,
      location: {
        address: this.createAccommodationForm.value.address,
        city: this.createAccommodationForm.value.city,
        country: this.createAccommodationForm.value.country,
        x: 0.0,
        y: 0.0
      },
      minGuests: this.createAccommodationForm.value.minGuests,
      maxGuests: this.createAccommodationForm.value.maxGuests,
      type: (this.createAccommodationForm.value.type !== null && this.createAccommodationForm.value.type !== undefined) ? this.createAccommodationForm.value.type as AccommodationTypeEnum : null,
      assets: this.createAccommodationForm.get('amenities')?.value,
      //prices: this.prices,
      ownerId:this.ownerId,//this.createAccommodationForm.value.ownerId,
      cancellationDeadline: this.createAccommodationForm.value.cancellationDeadline,
      images: this.images
    };
    
    this.accommodationService.create(accommodation).subscribe(
      (createdAccommodation: Accommodation) => {
        this.prices.forEach((priceCard: PriceCard) => {
          const newPriceCard = {
            timeSlot:priceCard.timeSlot,
            price: priceCard.price,
            type: priceCard.type,
            accommodationId:createdAccommodation.id
        };
        this.priceCardService.create(newPriceCard).subscribe({})
        this.openSnackBar('Sucessfully created request! Wait for admin to approve!');
        });  
      },
      (error) => {
        console.error('Error during creating new object:', error);
      }
     );
    } 
  }


