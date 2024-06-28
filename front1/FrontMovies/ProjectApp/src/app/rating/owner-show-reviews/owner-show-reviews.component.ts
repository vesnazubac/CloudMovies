import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Review } from 'src/app/accommodation/accommodation/model/review.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ReservationComponent } from 'src/app/reservation/reservation.component';
import { ReviewService } from '../review.service';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { ReviewPutDTO } from 'src/app/models/dtos/reviewPutDTO.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-owner-show-reviews',
  templateUrl: './owner-show-reviews.component.html',
  styleUrls: ['./owner-show-reviews.component.css'],
  standalone: true,
    imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, 
      MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule,
       CommonModule, LayoutModule, ReservationComponent]
})
export class OwnerShowReviewsComponent implements OnInit{
  role: RoleEnum ;
  ownerReviews:Review[];
  accessToken: any = localStorage.getItem('user');
  helper = new JwtHelperService();
  decodedToken = this.helper.decodeToken(this.accessToken);
  loggedInUserId=this.decodedToken.sub;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private authService: AuthService,
    private reviewService:ReviewService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ){}
  ngOnInit(): void {
    this.authService.userState.subscribe((result) => {
      if(result != null){
        this.role = result.role;
      }else{
       this.role=RoleEnum.UNAUTHENTICATED;
      }
     this.cdr.detectChanges();
    })

  
      this.reviewService.findByOwnerId(this.loggedInUserId).subscribe(
        (reviews) => {
         this.ownerReviews=reviews;
        },
        (error) => {
          console.error('Error fetching accommodation:', error);
        }
      );
   
  }
  reportReview(review:Review,id:number|undefined):void{
    const reviewPut: ReviewPutDTO = {
      userId: review.userId,
      type: review.type,
      comment: review.comment,
      accommodationId: review.accommodationId,
      ownerId: review.ownerId,
      grade: review.grade,
      dateTime: review.dateTime,
      deleted: review.deleted,
      reported: true,
      status: review.status
    };
    if(id!=undefined){
      console.log("ID JE " , id)
      this.reviewService.update(reviewPut, id).subscribe(
        updatedReview => {
          // Handle the updated review, if needed
          console.log('Review successfully updated:', updatedReview);
    
          // Show the snackbar message
         
        },
        error => {
          // Handle any errors during the update process
          console.error('Error updating review:', error);
        }
      );
    }
   
    this.snackBar.open("Successfully reported", 'Close', {
      duration: 3000, // Snackbar will be displayed for 3 seconds
    });

  }



  

}
