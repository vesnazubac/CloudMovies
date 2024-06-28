import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WineService} from "../wine.service";
import {Wine} from "../wine/model/wine.model";

@Component({
  selector: 'app-wine-details',
  templateUrl: './wine-details.component.html',
  styleUrls: ['./wine-details.component.css']
})
export class WineDetailsComponent implements OnInit{
  wine: Wine;

  constructor(private route: ActivatedRoute, private wineService: WineService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['wineId']
      this.wineService.getWine(id).subscribe({
        next: (data: Wine) => { this.wine = data }
      })
    })
  }

}
