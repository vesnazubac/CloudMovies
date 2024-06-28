import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WineComponent } from './wine/wine.component';
import { CreateWineComponent } from './create-wine/create-wine.component';
import { MaterialModule } from "../infrastructure/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { WineCardsComponent } from './wine-cards/wine-cards.component';
import { WineCardComponent } from './wine-card/wine-card.component';
import { WineDetailsComponent } from './wine-details/wine-details.component';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    WineComponent,
    CreateWineComponent,
    WineCardsComponent,
    WineCardComponent,
    WineDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    WineComponent,
    CreateWineComponent
  ]
})
export class WineModule { }
