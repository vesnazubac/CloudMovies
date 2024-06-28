import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component,OnInit,ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { ReservationComponent } from 'src/app/reservation/reservation.component';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css'],
  standalone: true,
  imports: [MatChipsModule,MatPaginatorModule, MatIconModule,MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatListModule, CommonModule, LayoutModule, ReservationComponent]
})
export class UsersViewComponent implements OnInit  {
  users: UserGetDTO[]
  dataSource:MatTableDataSource<UserGetDTO>;
  displayedColumns: string[] = ['Name', 'Username','Role','Address','Phone number','Status','actions'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private service: UserService,private route: ActivatedRoute,private router: Router) {

  }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data: UserGetDTO[]) => {
        this.users = data
        this.dataSource = new MatTableDataSource<UserGetDTO>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      
    })
  }

  viewReports(username:string){
    this.router.navigate(['/usersReports'], { queryParams: { userId: username } });
  }
}


