import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AccommodationDetails } from 'src/app/accommodation/accommodation/model/accommodationDetails.model';

@Component({
  selector: 'app-searched-accommodation',
  templateUrl: './searched-accommodation.component.html',
  styleUrls: ['./searched-accommodation.component.css'],
  standalone:true,
  imports:[MatCardModule]
})
export class SearchedAccommodationComponent {
  @Input()
  searchedAccommodation:AccommodationDetails;
  constructor(private router: Router) {}

  showDetails() {
    this.router.navigate(['/accommodations', this.searchedAccommodation.accommodation.id]);
  }
}
