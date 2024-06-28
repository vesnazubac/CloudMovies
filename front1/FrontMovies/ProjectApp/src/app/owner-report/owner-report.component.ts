import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Accommodation } from '../accommodation/accommodation/model/accommodation.model';
import { User } from '../models/user.model';
import { RoleEnum } from '../models/userEnums.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AccommodationDataService } from '../accommodation/accommodation-data.service.module';
import { AccommodationService } from '../accommodation/accommodation.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '../layout/layout.module';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Reservation } from '../models/reservation/reservation.model';
import { ReservationService } from '../models/reservation/reservation.service';
import { ReservationStatusEnum } from '../models/enums/reservationStatusEnum';
import { PriceTypeEnum } from '../models/enums/priceTypeEnum';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProfitData } from './profitData.model';
import { ProfitData2 } from './profitData2.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-owner-report',
  templateUrl: './owner-report.component.html',
  styleUrls: ['./owner-report.component.css'],
  standalone:true,
  imports:[MatTableModule,CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, LayoutModule,ReactiveFormsModule,MatDatepickerModule,MatButtonModule,MatNativeDateModule,MatSnackBarModule]
})
export class OwnerReportComponent {
  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  loggedInUserId=this.decodedToken.sub;
  role: RoleEnum ;
  wholeUser:User;

  accommodationList: Accommodation[] = []
  ownerAccommodations:Accommodation[] = []
  accommodationProfit: { [key: number]: number } = {};
  allReservations:Reservation[] = [];

  accommodationReservations:Reservation[]=[]
  numReservationsMonth: number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
  profitMonth: number[]=[0,0,0,0,0,0,0,0,0,0,0,0];

  profitData: ProfitData[]=[]
  profitColumns: string[] = ['accommodationId','accName' ,'profit'];
  profitDataSource=new MatTableDataSource<ProfitData>([])

  profitData2: ProfitData2[]=[]
  profitColumns2:string[] = ['month', 'numOfReservations','profit']
  profitDataSource2=new MatTableDataSource<ProfitData2>([])

  months:string[]=['January','February','March','April','May','June','July','August','September','October','November','December']

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private service: AccommodationService, private snackBar:MatSnackBar, private fb: FormBuilder,
    private dataService: AccommodationDataService,private router: Router,
    private authService: AuthService,private cdr: ChangeDetectorRef,
    private userService:UserService, private reservationService:ReservationService) {
  }

  ngOnInit(): void {
    this.service.getAllApproved().subscribe({
      next: (data: Accommodation[]) => {
       this.accommodationList = data
       console.log(this.accommodationList)
       console.log(this.loggedInUserId)
       this.initOwnerAccs()
       console.log(this.ownerAccommodations)
       console.log(this.accommodationProfit)
       this.profitDataSource=new MatTableDataSource<ProfitData>(this.profitData)
       this.profitDataSource.paginator=this.paginator;
       this.profitDataSource.sort=this.sort;

       this.profitDataSource2=new MatTableDataSource<ProfitData2>(this.profitData2)
       this.profitDataSource2.paginator=this.paginator
       this.profitDataSource2.sort=this.sort
      },
     error: (_) => {console.log("Greska!")}
    })
    
  }
  setDatesForm=this.fb.group({
    startDate: [null, Validators.required],
    endDate: [null, Validators.required]
  },{validators:this.dateValidator});
  reportForm2 = this.fb.group({
    accommodationId: [0, {
      validators: [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0)],
      asyncValidators: [],
      updateOn: 'blur',
    }],
    year: [0, {
      validators: [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0)],
      asyncValidators: [], 
      updateOn: 'blur', 
    }],
  });
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

  initOwnerAccs(){
    for(const a of this.accommodationList){
      if(a.ownerId==this.loggedInUserId){
        this.ownerAccommodations.push(a)
        if(a.id){
          this.accommodationProfit[a.id] = 0;
          let pd:ProfitData = new ProfitData(a.id,a.name,0);
          this.profitData.push(pd)
        }
        
      }
    }
  }
  validateDates():boolean{
    const startDate:Date = this.setDatesForm.value.startDate;
    const endDate:Date = this.setDatesForm.value.endDate;
    const today=new Date()
    if(startDate==null || endDate==null){
      this.openSnackBar('Must enter both dates');
      return false
    }
    if (startDate >= endDate) {
      this.openSnackBar('Start date must be before end date.');
      return false;
    }
    
    return true
  }
  generateReport1(){
    if(!this.validateDates())
      return

    for(const pd of this.profitData){
      pd.profit=0;
    }
    const startDate:Date = this.setDatesForm.value.startDate;
    const endDate:Date = this.setDatesForm.value.endDate;
    this.getAllReservations(() => {
      console.log(this.allReservations);
      for (const r of this.allReservations) {
        const reservationStartDate = new Date(r.timeSlot.startDate);
        const reservationEndDate = new Date(r.timeSlot.endDate);
      
        if (r.accommodation.id && r.status === ReservationStatusEnum.APPROVED && 
          reservationStartDate >= startDate && 
          reservationEndDate <= endDate &&
          r.accommodation.id in this.accommodationProfit
        ) {
          this.accommodationProfit[r.accommodation.id] += this.calculateTotalPrice(r);
          for(const pd of this.profitData){
            if(pd.accommodationId==r.accommodation.id){
              pd.profit+=this.calculateTotalPrice(r)
            }
          }
        }
      }
    });
    console.log(this.accommodationProfit)
    console.log(this.profitData)
    this.profitDataSource=new MatTableDataSource<ProfitData>(this.profitData)
    this.profitDataSource.paginator=this.paginator;
    this.profitDataSource.sort=this.sort;
  }
  calculateTotalPrice(r:Reservation):number{
    let ret=this.daysBetween(r.timeSlot.startDate,r.timeSlot.endDate)*r.price;
    if(r.priceType.toString()==="PERGUEST"){
      console.log("USAOOOOOOOOOO")
      ret=ret*r.numberOfGuests;
    }
    return ret;
  }
  daysBetween(arrival:Date, checkout:Date):number{
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const arrivalTime = new Date(arrival).getTime();
    const checkoutTime = new Date(checkout).getTime();

    const timeDifference = checkoutTime - arrivalTime;
    const daysDifference = Math.round(timeDifference / oneDayMilliseconds);

    return daysDifference;
  }
  getAllReservations(callback: () => void){
    this.reservationService.getAll().subscribe(
      (reservations: Reservation[]|undefined)=>{
        if(reservations){
          this.allReservations=reservations;
          console.log(this.allReservations)
          callback()
        }
      }
    )
  }
  generateReport2() {
    const accommodationId = this.reportForm2.get('accommodationId')?.value;
    const year = this.reportForm2.get('year')?.value;
    if (accommodationId !== null && year !== null && accommodationId!==undefined && year!==undefined) {
      if (isNaN(accommodationId) || isNaN(year)) {
        this.openSnackBar('Accommodation ID and Year must be numbers.');
        return;
      }
      let a=false
      for(const pd of this.profitData){
        if(pd.accommodationId==accommodationId)
          a=true
      }
      if(!a){
        this.openSnackBar('Invalid accommodation!')
        return
      }
      this.getAllReservationsByAccommodationId(accommodationId, () => {
        this.profitMonth=[0,0,0,0,0,0,0,0,0,0,0,0]
        this.numReservationsMonth=[0,0,0,0,0,0,0,0,0,0,0,0]
        this.profitData2.splice(0,this.profitData2.length)
        for (let i = 0; i < 12; i++) {
          const profitDataInstance = new ProfitData2(i, 0, 0);
          this.profitData2.push(profitDataInstance);
      }
        console.log(this.accommodationReservations);
        for(const res of this.accommodationReservations){
          const startDate=new Date(res.timeSlot.startDate)
          console.log(startDate)
          const startYear=startDate.getFullYear()
          const startMonth=startDate.getMonth()
          if(res.status===ReservationStatusEnum.APPROVED && startYear==year){
            const totalPrice=this.calculateTotalPrice(res)
            this.profitMonth[startMonth]+=totalPrice;
            this.numReservationsMonth[startMonth]+=1;

            this.profitData2[startMonth].numOfReservations+=1
            this.profitData2[startMonth].profit+=totalPrice
          }
        }
        console.log(this.profitMonth)
        console.log(this.numReservationsMonth)
        console.log(this.profitData2)
        this.profitDataSource2=new MatTableDataSource<ProfitData2>(this.profitData2)
        this.profitDataSource2.paginator=this.paginator
        this.profitDataSource2.sort=this.sort
      });

      console.log('Accommodation ID:', accommodationId);
      console.log('Year:', year);

    } else {
      this.openSnackBar('Accommodation ID and Year are required.');
    }
  }
  getAllReservationsByAccommodationId(accommodationId:number,callback: () => void){
    this.reservationService.getByAccommodationId(accommodationId).subscribe(
      (reservations: Reservation[]|undefined) => {
        if(reservations){
        this.accommodationReservations = reservations;
        
        console.log(this.accommodationReservations);
        callback()
        }
      },
      (error) => {
        console.error('Error getting reservations for accommodation:', error);
      }
    );
  }
  handleExport(){
    const invoiceContentElement=document.getElementById('entire-page') as HTMLElement;
    html2canvas(invoiceContentElement,{}).then(canvas=>{
      const imgData=canvas.toDataURL('image/png');

      const pageWidth=210;

      const height=canvas.height*pageWidth/canvas.width;

      const pdf=new jsPDF("p","mm","a4");
      pdf.addImage(imgData,'PNG',0,0,pageWidth,height);

      pdf.save('report.pdf');
    })
  }
}
