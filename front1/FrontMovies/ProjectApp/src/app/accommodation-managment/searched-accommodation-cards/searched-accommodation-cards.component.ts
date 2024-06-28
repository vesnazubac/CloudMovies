import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { AccommodationDataService } from 'src/app/accommodation/accommodation-data.service.module';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { AccommodationDetails } from 'src/app/accommodation/accommodation/model/accommodationDetails.model';
import { AccommodationTypeEnum } from 'src/app/models/enums/accommodationTypeEnum';

@Component({
  selector: 'app-searched-accommodation-cards',
  templateUrl: './searched-accommodation-cards.component.html',
  styleUrls: ['./searched-accommodation-cards.component.css'],
  standalone:true,
  imports:[CommonModule,MatCardModule,MatRadioModule,MatButtonModule,MatChipsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule, MatIconModule]
})
export class SearchedAccommodationCardsComponent implements OnInit{
  accommodationList: AccommodationDetails[] = [];
  filteredAccommodations:AccommodationDetails[] | undefined;
  accommodationTypeEnum=AccommodationTypeEnum;
  constructor(private accommodationService:AccommodationService,private dataService: AccommodationDataService,private router: Router) {}
  filterAccommodationForm=new FormGroup({
    amenities:new FormControl(),
    type: new FormControl(),
    minPrice: new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$')]),
    maxPrice: new FormControl(0,[Validators.required, Validators.pattern('^[0-9]+$')]),
  })
  ngOnInit(): void {
    this.dataService.searchedAccommodations$.subscribe((data) => {
      this.accommodationList = data;
      this.filteredAccommodations=data;
      console.log(this.accommodationList);
    });
  }
  showDetails(accommodation: AccommodationDetails) {
    // Navigate to the details page using the accommodation ID or any other identifier
    this.router.navigate(['/accommodations', accommodation.accommodation.id]);
  }
  filterData(){
    const type = this.filterAccommodationForm.get('type')?.value || "";
  const amenities = this.filterAccommodationForm.get('amenities')?.value || [];
  const minPrice = this.filterAccommodationForm.get('minPrice')?.value;
  const maxPrice = this.filterAccommodationForm.get('maxPrice')?.value;

  console.log('Selected type:', type);
  console.log('Selected amenities:', amenities.join(','));
  console.log('Minimum price:', minPrice);
  console.log('Maximum price:', maxPrice);

  // Build the HttpParams conditionally
  let params = new HttpParams().set('searched', JSON.stringify(this.accommodationList));

  if (type) {
    params = params.set('type', type.toString());
  }

  if (minPrice !== null && minPrice !== undefined) {
    params = params.set('minTotalPrice', minPrice.toString());
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    params = params.set('maxTotalPrice', maxPrice.toString());
  }

  if (amenities.length > 0) {
    const assetsString = amenities.join(',');
    params = params.set('assets', assetsString);
  }

  // Make the API call with the constructed params
  this.accommodationService.filter(params)
    .subscribe(
      (filteredAccommodations) => {
        this.filteredAccommodations = filteredAccommodations;
        console.log('Filtered Accommodations:', this.filteredAccommodations);
      },
      (error) => {
        console.error('Error filtering accommodations:', error);
      }
    );
  }
}
