import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { StatusEnum } from 'src/app/models/userEnums.model';
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { UserPutDTO } from 'src/app/models/userPutDTO.model';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent{
  user: User;
  allUsers:UserGetDTO[]
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private userService:UserService
  ){}

  ngOnInit(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const token = params.get('token')!;
      console.log(token);
      this.userService.activateAccount(token).subscribe(
        (response:any) => {
          console.log(response.message);
        },
        (error) => {
          console.error(error);
        }
      );
  });
  }
}
