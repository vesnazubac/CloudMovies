import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccommodationDataService } from 'src/app/accommodation/accommodation-data.service.module';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
import { AccommodationDetails } from 'src/app/accommodation/accommodation/model/accommodationDetails.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 
})
export class HomeComponent {
   accommodationList: Accommodation[] = []


   searchedAccommodations: AccommodationDetails[] | undefined
   constructor(private service: AccommodationService, private snackBar:MatSnackBar, private fb: FormBuilder,
    private dataService: AccommodationDataService,private router: Router) {
  }
  ngOnInit(): void {

    this.service.getAllApproved().subscribe({
       next: (data: Accommodation[]) => {
        this.accommodationList = data
       },
      error: (_) => {console.log("Greska!")}
     })
  }
  searchAccommodationForm = this.fb.group({
    city: [''],
    guests: [0, [Validators.pattern('^[0-9]+$'), Validators.min(1)]],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  }, { validators: this.dateValidator });

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
  dateValidator(formGroup: FormGroup) {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && startDate >= endDate) {
      formGroup.get('endDate')?.setErrors({ dateRange: true });
    } else {
      formGroup.get('endDate')?.setErrors(null);
    }

    if (startDate && endDate && startDate < new Date()) {
      formGroup.get('startDate')?.setErrors({ pastDate: true });
    } else {
      formGroup.get('startDate')?.setErrors(null);
    }

    if (endDate && endDate < new Date()) {
      formGroup.get('endDate')?.setErrors({ pastDate: true });
    } else {
      formGroup.get('endDate')?.setErrors(null);
    }

    return null;
  }

  formValidation():boolean{
    
    const guestsValue = this.searchAccommodationForm.get('guests')?.value;
    console.log(guestsValue);
    if (guestsValue!=undefined && isNaN(guestsValue)) {
      console.error('Please enter valid number for guests');
      this.openSnackBar('Please enter valid number for guests');
      return false;
    }else if(guestsValue!=undefined && guestsValue<=0){
      this.openSnackBar('Please enter valid number for guests');
      return false;
    }
      

      const startDate = new Date(this.searchAccommodationForm.get('startDate')?.value);
    const endDate = new Date(this.searchAccommodationForm.get('endDate')?.value);
    console.log(startDate)
    console.log(endDate)
    if(startDate>=endDate){
      this.openSnackBar('Dates are incorrect!');
      return false;
    }

    return true;
  }

  searchAccommodations() {
    if (!this.formValidation()) {
      return;
    }

    const city = this.searchAccommodationForm.get('city')?.value;
    const guests = this.searchAccommodationForm.get('guests')?.value;
    const startDate = this.searchAccommodationForm.get('startDate')?.value;
    const endDate = this.searchAccommodationForm.get('endDate')?.value;

    let params = new HttpParams()
      .set('arrivalString', formatDate(startDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'))
      .set('checkoutString', formatDate(endDate, 'yyyy-MM-dd HH:mm:ss', 'en-US'))
      .set('guests', guests.toString());

    if (city) {
      params = params.set('city', city);
    }

    this.service.search(params).subscribe({
      next: (data: AccommodationDetails[]) => {
        this.dataService.updateSearchedAccommodations(data);
        this.router.navigate(['/searched-accommodation-cards']);
      },
      error: (error) => {
        console.error('Error fetching accommodations:', error);
      },
    });
  }
  }

