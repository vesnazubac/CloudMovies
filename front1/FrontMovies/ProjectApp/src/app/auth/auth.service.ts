import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthResponse} from "./model/auth-resposne.model";
import {JwtHelperService} from "@auth0/angular-jwt";
import { environment } from 'src/env/env';
import { UserService } from '../user.service';
import { UserGetDTO } from '../models/userGetDTO.model';
import { RoleEnum, StatusEnum } from '../models/userEnums.model';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 userGet:UserGetDTO;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  });

  // user$ = new BehaviorSubject("");
  // userState = this.user$.asObservable();
  user$ = new BehaviorSubject<UserGetDTO | null>(null);
  userState = this.user$.asObservable();

  constructor(private http: HttpClient,private userService:UserService) {
    this.user$.next(this.getRole());
    this.initUser();
  }


  private initUser(): void {
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    if (decodedToken) {
      this.userService.getById(decodedToken.sub).subscribe(
        (user: UserGetDTO) => {
          if (user) {
            this.user$.next(user);
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('Error decoding JWT token');
    }
  }
  ngOnInit() {
 
  const accessToken: any = localStorage.getItem('user');
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(accessToken);
  
  if (decodedToken) {
   // console.log("USERNAMEEE 899 " , decodedToken.sub)
    // Subscribe to the observable to get the actual UserGetDTO
    this.userService.getById(decodedToken.sub).subscribe(
      (user: UserGetDTO) => {
        if (user) {
          // Now 'user' is the actual UserGetDTO
          this.userGet=user;
  
        }
      });
  } else {
    console.error('Error decoding JWT token');
  }
      
    }

  login(auth: any): Observable<AuthResponse> {
    //console.log("LOGG IN")
    return this.http.post<AuthResponse>(environment.apiHost + 'login', auth, {
      headers: this.headers,
    });
  }

  logout(): void {

    localStorage.clear();
    //  this.http.get(environment.apiHost + 'logOut', {

    //   responseType: 'text',
    // }).subscribe({
    //   next:()=>{
    //     localStorage.removeItem('user');
    //     this.user$.next(null);
    //   }
    // });
    // localStorage.removeItem('user');
    // this.user$.next(null);
  }
  

  getRole(): any {
    if (this.isLoggedIn()) {
      const accessToken: any = localStorage.getItem('CognitoIdentityServiceProvider.2amer6cbjphp31o6vpkcs469up.LastAuthUser');
      const helper = new JwtHelperService();
      //const decodedToken = helper.decodeToken(accessToken);
      //const user=this.userService.getById(decodedToken.sub);
      //console.log("AUTHORITY -> ",helper.decodeToken(accessToken).authority );
      return null //helper.decodeToken(accessToken).authority;
    //  return this.userGet.role;
    }
  
  }

  isLoggedIn(): boolean {
    //return localStorage.getItem('user') != null;
    return localStorage.getItem('CognitoIdentityServiceProvider.2amer6cbjphp31o6vpkcs469up.LastAuthUser') != null;
  }

  setUser(): void {
    const accessToken: any = localStorage.getItem('user');
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(accessToken);

    if (decodedToken) {
      //console.log("USERNAAAME --> ", decodedToken.sub)
      this.userService.getById(decodedToken.sub).subscribe(
        
        (user: UserGetDTO) => {
          if (user && user.status===StatusEnum.ACTIVE) {
            //console.log("IF USER --> ", decodedToken.sub)
            this.user$.next(user);
          }else{
            this.logout();
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.logout();
        }
      );
    } else {
      console.error('Error decoding JWT token');
      this.logout();
    }
    
  }
}
