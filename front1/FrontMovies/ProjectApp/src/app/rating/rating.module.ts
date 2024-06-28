import { CommonModule } from '@angular/common';
import { OwnerRatingComponent } from './owner-rating/owner-rating.component';
import { MatRadioButton } from '@angular/material/radio';
import { NgModule } from '@angular/core';
import {MaterialModule} from "../infrastructure/material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { HomeComponent } from '../layout/home/home.component';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { AccommodationRatingComponent } from './accommodation-rating/accommodation-rating.component';
import { AdminRatingRequestsComponent } from './admin-rating-requests/admin-rating-requests.component';
import { OwnerShowReviewsComponent } from './owner-show-reviews/owner-show-reviews.component';
import { OwnerRatingsReviewComponent } from './owner-ratings-review/owner-ratings-review.component';
import { AccommodationRatingsReviewComponent } from './accommodation-ratings-review/accommodation-ratings-review.component';


@NgModule({
  declarations: [
    OwnerRatingComponent,
    AccommodationRatingComponent,
    AdminRatingRequestsComponent,
    AccommodationRatingsReviewComponent,
    OwnerShowReviewsComponent,
    OwnerRatingsReviewComponent,
    AccommodationRatingsReviewComponent
  ],
  imports: [
    CommonModule,
    MatRadioButton,
    OwnerRatingComponent,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatRadioModule

  ]
})
export class RatingModule { }
