import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {MaterialModule} from "../infrastructure/material/material.module";
import { FooterComponent } from './footer/footer.component';
import {RouterModule} from "@angular/router";
import { AccommodationComponent } from '../accommodation/accommodation/accommodation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    NavBarComponent,
    FooterComponent,
    MapComponent,
    AccommodationComponent
  ],
  exports: [
    NavBarComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent
  ],
  imports: [
    
    CommonModule,
    MaterialModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class LayoutModule {

 }
