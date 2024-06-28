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
  selector: 'app-owner-ratings-review',
  templateUrl: './owner-ratings-review.component.html',
  styleUrls: ['./owner-ratings-review.component.css'],
  standalone: true,
  imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, 
      MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule,
       CommonModule, LayoutModule, ReservationComponent]

})
export class OwnerRatingsReviewComponent {

  constructor(private route: ActivatedRoute,private reviewService:ReviewService,private snackBar:MatSnackBar) { }

  ownersReviews:Review[] |null|undefined;
  ownerId:string |null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.ownerId = params['ownerId'];

      if (this.ownerId) {
        this.reviewService.findPendingByOwnerId(this.ownerId).subscribe((reviews: Review[] | null) => {
          this.ownersReviews = reviews;
        });
      }
    });
  }

  approveReview(review:Review){
    this.reviewService.approveReview(review.id).subscribe(
      () => {
        this.snackBar.open('Review successfully APPROVED !', 'Close', {
          duration: 3000
        });
        this.ownersReviews = this.ownersReviews?.filter(r => r.id !== review.id);
        console.log('Review approved successfully');
      },
      (error) => {
        console.error('Error approving review', error);
      }
    );
  }
  


  rejectReview(review:Review){
    this.reviewService.rejectReview(review.id).subscribe(
      () => {
        this.snackBar.open('Review successfully REJECTED !', 'Close', {
          duration: 3000
        });
        this.ownersReviews = this.ownersReviews?.filter(r => r.id !== review.id);
        console.log('Review rejected successfully');
      },
      (error) => {
        console.error('Error rejecting review', error);
      }
    );
    
  }

 }



