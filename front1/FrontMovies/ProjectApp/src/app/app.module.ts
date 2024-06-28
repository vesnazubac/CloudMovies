import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LayoutModule} from "./layout/layout.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {WineModule} from "./wine/wine.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AccommodationModule } from './accommodation/accommodation.module';
import { MatNativeDateModule } from '@angular/material/core';
import { Interceptor } from './auth/interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { MaterialModule } from './infrastructure/material/material.module';
import { ReservationComponent } from './reservation/reservation.component';
import { OwnerReportComponent } from './owner-report/owner-report.component';



@NgModule({
  declarations: [
    AppComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    WineModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    AuthModule,
    MaterialModule,
    ReservationComponent,
    OwnerReportComponent,
    MatDatepickerModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  },],
  bootstrap: [AppComponent]

})
export class AppModule { }
