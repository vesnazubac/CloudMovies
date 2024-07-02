import { ChangeDetectorRef, Component, Injectable, NgZone } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/auth/auth.service';
import { MovieGetDTO } from 'src/app/models/movieGetDTO.model';
import { RoleEnum } from 'src/app/models/userEnums.model';
import { UserGetDTO } from 'src/app/models/userGetDTO.model';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/env/env';

@Injectable()
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private authService: AuthService,private userService:UserService) {}
  user:UserGetDTO;
  role: RoleEnum ;
 // private cdr: ChangeDetectorRef;
  
  
  ngOnInit(): void {
 
  
    this.authService.userState.subscribe((result) => {
      if(result != null){
        this.role = result.role;
      }else{
       this.role=RoleEnum.UNAUTHENTICATED;
      }
     // this.cdr.detectChanges();
    })
  }

  logout(): void {
    console.log("LOG OUT ")
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    let userGroups = localStorage.getItem('Group');
    if (userGroups) {
        //let groupsArray = JSON.parse(userGroups); // Pretvaranje stringa u JavaScript objekat (niz)
        return userGroups.includes('Admins');
    }
    return false; // Vraća false ako nije pronađen 'Admins' u nizu
}

  isGuest(): boolean {
    return this.authService.getRole() == RoleEnum.GUEST;
  }

  isOwner(): boolean {
    return this.authService.getRole() == RoleEnum.OWNER;
  }

  testClicked(){
    console.log('Dugme je kliknuto!');
    this.userService.getAllMovies().subscribe(
      (movies: MovieGetDTO[]) => {
        console.log('Svi filmovi:', movies);
      },
      error => {
        console.error('Greška pri dohvaćanju filmova:', error);
      }
    );
  }
  

 }
 



