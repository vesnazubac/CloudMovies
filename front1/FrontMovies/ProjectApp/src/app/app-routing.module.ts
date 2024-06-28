import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./layout/home/home.component";
import { LoginFormComponent } from './login/login-form/login-form.component';
import { RegisterFormComponent } from './register/register-form/register-form.component';
import { EditAccountComponent } from './accountmanagement/edit-account/edit-account.component';
import { CreateAccommodationComponent } from './accommodation-managment/create-accommodation/create-accommodation.component';
import { EditAccommodationComponent } from './accommodation-managment/edit-accommodation/edit-accommodation.component';
import { AccommodationComponent } from './accommodation/accommodation/accommodation.component';
import { AccommodationCardsComponent } from './accommodation/accommodation-cards/accommodation-cards.component';
import { AccommodationDetailsComponent } from './accommodation/accommodation-details/accommodation-details.component';
import { UsersViewComponent } from './users/users-view/users-view.component';
import { CreateReservationComponent } from './reservation-managment/create-reservation/create-reservation.component';
import { EditReservationComponent } from './reservation-managment/edit-reservation/edit-reservation.component';
import { SuccessComponent } from './register/success/success.component';
import { AccommodationRequestsComponent } from './accommodation-managment/accommodation-requests/accommodation-requests.component';
import { SearchedAccommodationCardsComponent } from './accommodation-managment/searched-accommodation-cards/searched-accommodation-cards.component';
import { SearchedAccommodationComponent } from './accommodation-managment/searched-accommodation/searched-accommodation.component';
import { OwnersAccommodationsComponent } from './accommodation-managment/owners-accommodations/owners-accommodations.component';
import { AccommodationsReservationsComponent } from './accommodation-managment/accommodations-reservations/accommodations-reservations.component';
import { GuestsReservationsComponent } from './reservation-managment/guests-reservations/guests-reservations.component';
import { OwnerRatingComponent } from './rating/owner-rating/owner-rating.component';
import { AccommodationRatingComponent } from './rating/accommodation-rating/accommodation-rating.component';
import { AdminRatingRequestsComponent } from './rating/admin-rating-requests/admin-rating-requests.component';
import { OwnerShowReviewsComponent } from './rating/owner-show-reviews/owner-show-reviews.component';
import { OwnerRatingsReviewComponent } from './rating/owner-ratings-review/owner-ratings-review.component';
import { AccommodationRatingsReviewComponent } from './rating/accommodation-ratings-review/accommodation-ratings-review.component';
import { UserReportsService } from './reports/reports.service';
import { GuestsReportingOwnersComponent } from './reports/guests-reporting-owners/guests-reporting-owners.component';
import { UserReportsComponent } from './users/user-reports/user-reports.component';
import { FavouriteAccommodationsComponent } from './accommodation-managment/favourite-accommodations/favourite-accommodations.component';
import { OwnerReportComponent } from './owner-report/owner-report.component';
import { UsersNotificationsComponent } from './users/users-notifications/users-notifications.component';
const routes: Routes = [
  {component: HomeComponent, path:"home"},
  {component:LoginFormComponent, path:"login"},
  {component:RegisterFormComponent,path:"register"},
  {component:SuccessComponent, path:"activate/:token"},
  {component:EditAccountComponent,path:"editAccount"},
  {component:CreateAccommodationComponent,path:"createAccommodation"},
  {component:EditAccommodationComponent, path:"editAccommodation/:id"},
  {component:CreateReservationComponent, path:"createReservation"},
  {component:EditReservationComponent, path:"editReservation"},
  {component:AccommodationComponent,path:"accommodation"},
  {component:AccommodationCardsComponent,path:"accommodation-cards"},
  {component: AccommodationDetailsComponent ,path: 'accommodations/:id'},
  {component:UsersViewComponent,path:'users-view'},
  {component:AccommodationRequestsComponent,path:'accommodationsRequests'},
  {component:SearchedAccommodationCardsComponent,path:'searched-accommodation-cards'},
  {component:SearchedAccommodationComponent,path:'searched-accommodation'},
  {component:OwnersAccommodationsComponent,path:'ownersAccommodations'},
  {component:AccommodationsReservationsComponent,path:'accommodationsReservations/:id'},
  {component:GuestsReservationsComponent,path:'guestsReservations'},
  {component:OwnerRatingComponent,path:'ownerRating/:id'},
  {component:AccommodationRatingComponent,path:'accommodationRating/:id'},
  {component:AdminRatingRequestsComponent,path:'adminRatingRequests'},
  {component:AccommodationRatingComponent,path:'accommodationRating/:id/:reservationId'},
  {component:OwnerShowReviewsComponent,path:'ownerRatings'},
  {component:OwnerRatingsReviewComponent,path:'ownersRatingReviews'},
  {component:AccommodationRatingsReviewComponent,path:'accommodationsRatingReviews'},
  {component:GuestsReportingOwnersComponent,path:'userReports'},
  {component:UserReportsComponent,path:'usersReports'},
  {component:FavouriteAccommodationsComponent,path:'favouriteAccommodations'},
  {component:OwnerReportComponent,path:'ownerReport'},
  {component:UsersNotificationsComponent,path:'myNotifications'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
