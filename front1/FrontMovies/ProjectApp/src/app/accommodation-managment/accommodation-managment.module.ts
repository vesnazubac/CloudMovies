import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { AvailabilityCardComponent } from './availability-card/availability-card.component';
import { EditAccommodationComponent } from './edit-accommodation/edit-accommodation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditPriceCardDialogComponent } from './edit-price-card-dialog/edit-price-card-dialog.component'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccommodationRequestsComponent } from './accommodation-requests/accommodation-requests.component';
import { AccommodationReviewDialogComponent } from './accommodation-review-dialog/accommodation-review-dialog.component';
import { SearchedAccommodationComponent } from './searched-accommodation/searched-accommodation.component';
import { SearchedAccommodationCardsComponent } from './searched-accommodation-cards/searched-accommodation-cards.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../infrastructure/material/material.module';
import { OwnersAccommodationsComponent } from './owners-accommodations/owners-accommodations.component';
import { AccommodationsReservationsComponent } from './accommodations-reservations/accommodations-reservations.component';
import { FavouriteAccommodationsComponent } from './favourite-accommodations/favourite-accommodations.component';
import { AccommodationComponent } from '../accommodation/accommodation/accommodation.component';
import { LayoutModule } from '../layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';


@NgModule({
  declarations: [
    CreateMovieComponent,
    EditAccommodationComponent,
   EditPriceCardDialogComponent,
   AccommodationRequestsComponent,
   AccommodationReviewDialogComponent,
   SearchedAccommodationComponent,
   SearchedAccommodationCardsComponent,
   OwnersAccommodationsComponent,
   AccommodationsReservationsComponent,
   FavouriteAccommodationsComponent,
   MySubscriptionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepicker,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MaterialModule,
    HttpClientModule
  ]
})
export class AccommodationManagmentModule { }
