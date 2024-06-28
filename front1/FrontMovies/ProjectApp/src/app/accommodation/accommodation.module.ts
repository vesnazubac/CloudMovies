import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationComponent } from './accommodation/accommodation.component';
import { AccommodationCardsComponent } from './accommodation-cards/accommodation-cards.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { AccommodationDetailsComponent } from './accommodation-details/accommodation-details.component';

@NgModule({
  declarations: [
    //AccommodationComponent,
    AccommodationCardsComponent,
    //AccommodationDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    AccommodationDetailsComponent
  ]
})
export class AccommodationModule { }
