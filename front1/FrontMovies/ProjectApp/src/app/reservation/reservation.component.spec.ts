import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './reservation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../models/reservation/reservation.service';
import { By } from '@angular/platform-browser';
import { MatNativeDateModule } from '@angular/material/core';

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports:[ReservationComponent,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatSlideToggleModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        MatNativeDateModule
      ],
      providers:[
        {provide:ActivatedRoute, useValue:{}},
        {provide:Router, useValue:{}},
        JwtHelperService,
        MatSnackBar,
        ReservationService
      ]
    });
    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should form fields be initially empty/0',()=>{
    expect(component.reservationForm.get('guests')?.value).toEqual(0);
    expect(component.reservationForm.get('startDate')?.value).toEqual(null);
    expect(component.reservationForm.get('endDate')?.value).toEqual(null);
  });

  it('should make input into all form fields',()=>{
    let el=fixture.debugElement.query(By.css('[formControlName=\'guests\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el=fixture.debugElement.query(By.css('[formControlName=\'startDate\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
    el=fixture.debugElement.query(By.css('[formControlName=\'endDate\']')).nativeElement;
    expect(el.getAttribute('readonly')).toEqual(null);
  });

  it('should set form validity to false if invalid number of guests is provided',()=>{
    component.reservationForm.setValue({
      guests:'-1',
      startDate:'02/14/2024',
      endDate:'02/15/2024'
    });

    expect(component.isFormValid).toBeFalse();
  });

  it('should set form validity to false if dates dont match',()=>{
    component.reservationForm.setValue({
      guests:'4',
      startDate:'02/15/2024',
      endDate:'02/14/2024'
    });
    
    expect(component.goodDates()).toBeFalse();
  });


  it('Should show required error message for guests field', fakeAsync(() => {
    component.ngOnInit();
    tick();
  
    component.reservationForm.setValue({
      guests:'',
      startDate:'02/14/2024',
      endDate:'02/15/2024'
    });

    expect(component.formValidation()).toBeFalsy()

  }));

});
