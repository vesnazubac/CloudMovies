import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Accommodation } from '../accommodation/model/accommodation.model';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { AccommodationService } from '../accommodation.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { LayoutModule } from "../../layout/layout.module";
import { ReservationComponent } from "../../reservation/reservation.component";
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PriceCard } from '../accommodation/model/priceCard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Review } from '../accommodation/model/review.model';
import { ReviewService } from 'src/app/rating/review.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReviewStatusEnum } from 'src/app/models/enums/reviewStatusEnum';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';

@Component({
    selector: 'app-accommodation-details',
    templateUrl: './accommodation-details.component.html',
    styleUrls: ['./accommodation-details.component.css'],
    standalone: true,
    imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, CommonModule, LayoutModule, ReservationComponent]
})
export class AccommodationDetailsComponent implements OnInit,AfterViewInit{
  accommodation: Accommodation | undefined;
  averageGradeOwner: number | undefined=0.00;
  averageGradeAccommodation: number | undefined=0.00;
  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  loggedInUserId:string;
  ownerId:string;

  
  availableDates: Date[] = [];
  user:UserGetDTO;
  role: RoleEnum ;
  wholeUser:User;
  dataSource = new MatTableDataSource<PriceCard>([]);
  displayedColumns: string[] = ['Id', 'Start Date', 'End Date', 'Price','Type'];
  accommodationReviews:Review[];
  ownerReviews:Review[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private accommodationService:AccommodationService,
    private authService: AuthService,
    private reviewService:ReviewService,
    private cdr: ChangeDetectorRef,
    private userService:UserService,
    private snackBar:MatSnackBar
  ){}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
    });
  }
  ngOnInit() {

   
    this.averageGradeAccommodation=0.00;
    this.averageGradeOwner=0.00;

    if(this.decodedToken){
      this.loggedInUserId=this.decodedToken.sub;
      this.authService.userState.subscribe((result) => {
        if(result != null){
          this.role = result.role;
          console.log(this.loggedInUserId)
      this.userService.getUserById(this.loggedInUserId).subscribe(
        (foundUser) =>{
          if(foundUser){
            this.wholeUser=foundUser;
          }
        }
      )
        }else{
         this.role=RoleEnum.UNAUTHENTICATED;
        }
       this.cdr.detectChanges();
      })
    }
    
    
    this.route.paramMap.subscribe((params: ParamMap) => {
      const accommodationId = +params.get('id')!;
      this.averageGradeAccommodation=this.calculateAverageGradeAccommodation(accommodationId);
      console.log(this.averageGradeAccommodation)
      this.accommodationService.getById(accommodationId).subscribe(
        (foundAccommodation) => {
          if (foundAccommodation) {
            this.accommodation = foundAccommodation;
            this.averageGradeOwner=this.calculateAverageGradeOwner(foundAccommodation.ownerId);
            console.log(this.accommodation);
            
            this.dataSource=new MatTableDataSource<PriceCard>(this.accommodation.prices);
            this.dataSource.paginator=this.paginator;
            this.dataSource.sort=this.sort;

            
            this.fetchAccommodationReviews(accommodationId);
            this.fetchOwnerReviews(this.accommodation.ownerId);
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
  isInGuestFavourites(accommodationId:number):boolean{
    const guestFavourites=this.wholeUser.favouriteAccommodations.split(",")
    const accommodationIdString = accommodationId.toString();
    return guestFavourites.includes(accommodationIdString);
  }
  addToFavourites() {
    if(this.accommodation?.id)
    this.userService.addFavourite(this.wholeUser.username, this.accommodation.id).subscribe(
        () => {
            this.openSnackBar("Added to favourites")
            this.ngOnInit()
        },
        (error) => {
            console.error('Failed to add to favourites', error);
        }
    );
  }

  removeFromFavourites() {
    if(this.accommodation?.id)
    this.userService.removeFavourite(this.wholeUser.username, this.accommodation.id).subscribe(
        () => {
            this.openSnackBar("Removed from favourites");
            this.ngOnInit()
        },
        (error) => {
            console.error('Failed to remove from favourites', error);
        }
    );
  }
  fetchAccommodationReviews(accommodationId: number) {
    this.reviewService.findByAccommodationId(accommodationId).subscribe(
      (reviews) => {
        const approvedReviews = [];
      
        for (const review of reviews) {
          if (review.status.toString()=="APPROVED") {
            approvedReviews.push(review);
          //  this.calculateAverageGradeAccommodation(review.accommodationId)
          }
        }
        
        this.accommodationReviews = approvedReviews;
        console.log(approvedReviews)
        console.log('Accommodation reviews:', this.accommodationReviews);
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }
  fetchOwnerReviews(ownerId: string) {
    this.reviewService.findByOwnerId(ownerId).subscribe(
      (reviews) => {
        const approvedReviews = [];
        for (const review of reviews) {
   
          if (review.status.toString()=="APPROVED") {
            approvedReviews.push(review);
          }
        }
        
        this.ownerReviews = approvedReviews;
        console.log('Owner reviews:', this.ownerReviews);
        console.log(approvedReviews)
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/home']);
  }
  // Add a getter to explicitly check for non-null images
  get accommodationImages(): string[] | undefined {
    return this.accommodation?.images;
  }

  isDateAvailable(date: Date): boolean {
    return this.availableDates.some((availableDate) => this.isSameDate(date, availableDate));
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
   deleteReview(id:number|undefined):void{
   if(id!=undefined){
    this.reviewService.delete(id).subscribe(
      () => {
        console.log(`Review with ID ${id} deleted successfully`);
        
        // Optionally, you can fetch the updated reviews after deletion
        const accommodationId = this.accommodation?.id || 0;
        this.fetchAccommodationReviews(accommodationId);
      },
      (error) => {
        console.error(`Error deleting review with ID ${id}:`, error);
      }
    );
   }
    
  }

  calculateAverageGradeAccommodation(accommodationId: number): number {
    let averageGrade: number = 0; // ili neka podrazumevana vrednost
    let sum:number=0;
    this.averageGradeAccommodation=0.00;

    this.reviewService.findByAccommodationId(accommodationId).subscribe(
      (reviews: Review[]) => {
        // Handle the list of reviews here
        let numberOfReviews: number = 0;
        for (const review of reviews) {
          if(review.status.toString()==="APPROVED"){
            sum=sum+review.grade;
            numberOfReviews=numberOfReviews+1
          }
          // Do something with each review
          
       
          // Add more properties or actions as needed
        }
        console.log("num: ", numberOfReviews)
        averageGrade=sum / numberOfReviews
        console.log("AVERAGE  GRADE : ",averageGrade)
        if(numberOfReviews!=0){
          this.averageGradeAccommodation=averageGrade;
        }else{
          this.averageGradeAccommodation=0.00;
        }
      
        return averageGrade;
        // Do further processing or manipulation if needed
      },
      (error: any) => {
        console.error('Error retrieving reviews:', error);
        // Handle the error as needed
      }
    );

   return averageGrade;
  
    
    //   this.reviewService.findAverageGradeByAccommodationId(accommodationId).subscribe(
    //     (grade: number) => {
    //       averageGrade = grade;
    //     },
    //     (error: any) => {
    //       console.error('Greška pri dobijanju prosečne ocene smestaja:', error);
    //     }
    //   );
      
    
    // return averageGrade;
    // return this.reviewService.findAverageGradeByOwnerId(ownerId);
  }

 
  


  calculateAverageGradeOwner(ownerId: string): number {

    let averageGrade: number = 0; // ili neka podrazumevana vrednost
    let sum:number=0;
    this.averageGradeOwner=0.00;


    this.reviewService.findByOwnerId(ownerId).subscribe(
      (reviews: Review[]) => {
        // Handle the list of reviews here
       let numberOfReviews: number =0;
        for (const review of reviews) {
          if(review.status.toString()==="APPROVED"){
            sum=sum+review.grade;
            numberOfReviews=numberOfReviews+1
          }
          // Do something with each review
         
       
          // Add more properties or actions as needed
        }
        console.log("num: ", numberOfReviews)
        averageGrade=sum / numberOfReviews
        console.log("AVERAGE  GRADE : ",averageGrade)
       // this.averageGradeOwner=averageGrade;
        if(numberOfReviews!=0){
          this.averageGradeOwner=averageGrade;
        }else{
          this.averageGradeOwner=0.00;
        }
        return averageGrade;
        // Do further processing or manipulation if needed
      },
      (error: any) => {
        console.error('Error retrieving reviews:', error);
        // Handle the error as needed
      }
    );

   return averageGrade;
  
    
    // return this.reviewService.findAverageGradeByOwnerId(ownerId);
  }

 






}