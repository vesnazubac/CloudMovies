import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AccommodationDetails } from "./accommodation/model/accommodationDetails.model";

@Injectable({
    providedIn: 'root'
  })
  export class AccommodationDataService {
    private searchedAccommodationsSource = new BehaviorSubject<AccommodationDetails[]>([]);
    searchedAccommodations$ = this.searchedAccommodationsSource.asObservable();
  
    updateSearchedAccommodations(data: AccommodationDetails[]) {
      this.searchedAccommodationsSource.next(data);
    }
  }