import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestsReportingOwnersComponent } from './guests-reporting-owners/guests-reporting-owners.component';

import { MatRadioButton } from '@angular/material/radio';

import {MaterialModule} from "../infrastructure/material/material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { HomeComponent } from '../layout/home/home.component';
import { Router } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    GuestsReportingOwnersComponent,
  ],
  imports: [
    CommonModule,
    MatRadioButton,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatRadioModule,
    GuestsReportingOwnersComponent

  ]
})
export class ReportsModule { }
