import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WineService} from "../wine.service";
import {Wine} from "./model/wine.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
})
export class WineComponent implements OnInit {
  wines: Wine[]
  dataSource: MatTableDataSource<Wine>;
  displayedColumns: string[] = ['name', 'year', 'description', 'grapes', 'country'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: WineService) {

  }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data: Wine[]) => {
        this.wines = data
        this.dataSource = new MatTableDataSource<Wine>(this.wines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (_) => {console.log("Greska!")}
    })
  }
}
