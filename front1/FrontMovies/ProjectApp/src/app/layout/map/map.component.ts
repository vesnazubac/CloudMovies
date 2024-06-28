import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "./map.service";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccommodationService } from 'src/app/accommodation/accommodation.service';
import { Accommodation } from 'src/app/accommodation/accommodation/model/accommodation.model';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  accommodation: Accommodation | undefined;
  constructor(private mapService: MapService,
    private route:ActivatedRoute,
    private router:Router,
    private accommodationService:AccommodationService) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const accommodationId = +params.get('id')!;
      this.accommodationService.getById(accommodationId).subscribe(
        (foundAccommodation) => {
          if (foundAccommodation) {
            this.accommodation = foundAccommodation;
            this.initMap(this.accommodation);
          } else {
            console.error(`Accommodation with ID ${accommodationId} not found`);
          }
        },
        (error) => {
          console.error('Error fetching accommodation:', error);
        }
      );
    });
}
  private initMap(accommodation:Accommodation): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.search(accommodation)
  }

  search(accommodation:Accommodation): void {
    if(accommodation){
    this.mapService.search(accommodation?.location.address+", "+accommodation?.location.city).subscribe({
      next: (result) => {
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup(accommodation.name)
          .openPopup();
      },
      error: () => {},
    });
    }
    
  }

  ngAfterViewInit(): void {
    if (this.accommodation) {
      L.Marker.prototype.options.icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      });
      this.initMap(this.accommodation);
    }
  }
}
