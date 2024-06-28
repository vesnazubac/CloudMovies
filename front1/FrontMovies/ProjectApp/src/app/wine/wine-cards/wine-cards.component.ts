import {Component, OnInit} from '@angular/core';
import {WineService} from "../wine.service";
import {Wine} from "../wine/model/wine.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-wine-cards',
  templateUrl: './wine-cards.component.html',
  styleUrls: ['./wine-cards.component.css']
})
export class WineCardsComponent implements OnInit {

  wines: Wine[];
  clickedWine: string = ''

  constructor(private service: WineService) {
  }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data: Wine[]) => {
        this.wines = data
      },
      error: (_) => {console.log("Greska!")}
    })
  }

  onWineClicked(wine: Wine): void {
    this.clickedWine = wine.name + " " + wine.id;
  }

}
