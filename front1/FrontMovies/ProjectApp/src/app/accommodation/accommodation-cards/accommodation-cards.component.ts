import { Component } from '@angular/core';
import { Accommodation } from '../accommodation/model/accommodation.model';
import { AccommodationService } from '../accommodation.service';

@Component({
  selector: 'app-accommodation-cards',
  templateUrl: './accommodation-cards.component.html',
  styleUrls: ['./accommodation-cards.component.css']
})
export class AccommodationCardsComponent {
   accommodationList: Accommodation[] = []
//     id: 1,
//     name: 'Cozy Cottage',
//     description: "Escape to a charming cottage near the countryside where tranquility meets comfort. This cozy retreat is designed to provide a warm and inviting atmosphere for your stay. Surrounded by nature, the Cozy Cottage offers a perfect blend of rustic charm and modern amenities. Whether you're looking for a romantic getaway or a family vacation, this retreat in Rural Retreat, USA, promises a delightful experience for a minimum of 2 and a maximum of 4 guests. The accommodation is currently available for booking at a price of $150.0 per night, with a commendable rating of 4.4.",
//     location: 'Rural Retreat, USA',
//     minGuests: 2,
//     maxGuests: 4,
//     status: 'Available',
//     image: '../../assets/images/accommodation1.jpg',
//     price: 150.0,
//     rating: 4.4
//   },
//   {
//     id: 2,
//     name: 'Luxury Beachfront Villa',
//     description: 'Indulge in the epitome of luxury with our elegant beachfront villa boasting stunning ocean views. Located in the Tropical Paradise of the Maldives, this opulent retreat is perfect for those seeking a lavish escape. The villa accommodates a minimum of 6 and a maximum of 10 guests, offering an exclusive and tranquil experience. Currently booked, this sought-after accommodation is priced at $200.0 per night and has earned a rating of 3.9.',
//     location: 'Tropical Paradise, Maldives',
//     minGuests: 6,
//     maxGuests: 10,
//     status: 'Booked',
//     image: '../../assets/images/accommodation2.jpg',
//     price: 200.0,
//     rating: 3.9
//   },
//   {
//     id: 3,
//     name: 'Mountain Retreat Cabin',
//     description: 'Discover serenity in a cozy cabin nestled amidst the breathtaking mountains of Serenity Peaks, Canada. This mountain retreat offers a perfect escape from the hustle and bustle of everyday life. Ideal for a romantic getaway or a small group retreat, the cabin accommodates a minimum of 2 and a maximum of 6 guests. Currently available for booking at $175.0 per night, this retreat boasts a rustic charm with a rating of 3.3.',
//     location: 'Serenity Peaks, Canada',
//     minGuests: 2,
//     maxGuests: 6,
//     status: 'Available',
//     image: '../../assets/images/accommodation3.jpg',
//     price: 175.0,
//     rating: 3.3
//   },
//   {
//     id: 4,
//     name: 'Urban City Loft',
//     description: 'Immerse yourself in the vibrant energy of Metropolis City, USA, with a stay in this modern loft in the heart of the city. Designed for urban comfort, this accommodation is perfect for solo travelers or small groups, accommodating a minimum of 1 and a maximum of 3 guests. Currently available for booking at $125.0 per night, this urban retreat offers a stylish and convenient stay with a stellar rating of 4.7.',
//     location: 'Metropolis City, USA',
//     minGuests: 1,
//     maxGuests: 3,
//     status: 'Available',
//     image: '../../assets/images/accommodation4.jpg',
//     price: 125.0,
//     rating: 4.7
//   },
//   {
//     id: 5,
//     name: 'Historic Bed and Breakfast',
//     description: 'Step back in time with a stay at this historic Bed and Breakfast in the charming Old Town of the United Kingdom. This period charm-filled accommodation accommodates a minimum of 2 and a maximum of 8 guests, offering a unique and nostalgic experience. Currently available for booking at $160.0 per night, this historic B&B boasts an exceptional rating of 4.9.',
//     location: 'Old Town, United Kingdom',
//     minGuests: 2,
//     maxGuests: 8,
//     status: 'Available',
//     image: '../../assets/images/accommodation5.jpg',
//     price: 160.0,
//     rating: 4.9
//   },
//   {
//     id: 6,
//     name: 'Historic Bed and Breakfast',
//     description: 'Experience the charm of a bygone era with a stay at this historic Bed and Breakfast in the heart of Old Town, United Kingdom. Immerse yourself in the unique ambiance of this carefully preserved establishment, offering accommodations for a minimum of 2 and a maximum of 8 guests. Currently available for booking at $160.0 per night, this historic gem has garnered a remarkable rating of 4.9.',
//     location: 'Old Town, United Kingdom',
//     minGuests: 2,
//     maxGuests: 8,
//     status: 'Available',
//     image: '../../assets/images/accommodation5.jpg',
//     price: 160.0,
//     rating: 4.9
//   },
//   {
//     id: 7,
//     name: 'Urban City Loft',
//     description: 'Immerse yourself in the lively atmosphere of Metropolis City, USA, with a stay in this modern loft situated in the heart of the city. Perfect for solo travelers or small groups, this accommodation accommodates a minimum of 1 and a maximum of 3 guests. Currently available for booking at $125.0 per night, this urban retreat offers a stylish and convenient stay with a remarkable rating of 4.7.',
//     location: 'Metropolis City, USA',
//     minGuests: 1,
//     maxGuests: 3,
//     status: 'Available',
//     image: '../../assets/images/accommodation4.jpg',
//     price: 125.0,
//     rating: 4.7
//   },
//   {
//     id: 8,
//     name: 'Mountain Retreat Cabin',
//     description: 'Escape to a cozy cabin nestled in the serene mountains of Serenity Peaks, Canada. This mountain retreat offers a perfect blend of natural beauty and comfort, providing a peaceful getaway for a minimum of 2 and a maximum of 6 guests. Currently available for booking at $175.0 per night, this cabin has a rating of 3.3, ensuring a tranquil and rejuvenating experience.',
//     location: 'Serenity Peaks, Canada',
//     minGuests: 2,
//     maxGuests: 6,
//     status: 'Available',
//     image: '../../assets/images/accommodation3.jpg',
//     price: 175.0,
//     rating: 3.3
//   }
// ];
  //clickedWine: string = ''

  constructor(private service: AccommodationService) {
  }

  ngOnInit(): void {
    // this.service.getAll().subscribe({
    //   next: (data: Accommodation[]) => {
    //     this.accommodationList = data
    //   },
    //   error: (_) => {console.log("Greska!")}
    // })
  }
}
