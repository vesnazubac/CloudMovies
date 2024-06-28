import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Login } from 'src/app/auth/model/login.model';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/env/env';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,ReactiveFormsModule]
})
export class LoginFormComponent {
   hide:boolean=true;
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  private userPoolData = {
    UserPoolId: environment.userPoolId,
    ClientId: environment.userPoolClientId
  };

  private userPool = new CognitoUserPool(this.userPoolData);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (this.loginForm.valid) {
      const username = this.usernameInput.nativeElement.value;
      const password = this.passwordInput.nativeElement.value;

      const authenticationData = {
        Username: username,
        Password: password
      };

      const authenticationDetails = new AuthenticationDetails(authenticationData);

      const userData = {
        Username: authenticationData.Username,
        Pool: this.userPool
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          
          console.log('Login successful:', result);
          this.router.navigate(['/home']);
          // Uzimanje tokena pristupa iz localStorage-a
const accessToken = localStorage.getItem('CognitoIdentityServiceProvider.2amer6cbjphp31o6vpkcs469up.a3743812-d031-7047-b085-bee35a0e2046.accessToken');

// Parsiranje JWT tokena pristupa da biste dobili informacije
const tokenParts = accessToken?.split('.');
const encodedPayload = tokenParts ? tokenParts[1] : '';
const decodedPayload = atob(encodedPayload);
const tokenPayload = JSON.parse(decodedPayload);

// Dobijanje korisničkog imena iz payload-a
//const username = tokenPayload.sub;

// console.log('Username:', username);
const username=this.getUsernameFromSub(tokenPayload.sub)

        },
        onFailure: (err) => {
          console.error('Login failed:', err);
        },
      });
    }
  }

  register() {
    this.router.navigate(['register']);
  }

  
// Konfiguracija za vaš User Pool


// Funkcija za dobijanje korisničkog imena na osnovu sub identifikatora
 
 
// Funkcija za dobijanje korisničkog imena na osnovu sub identifikatora
  getUsernameFromSub(sub: string) {
   const  poolData1 = {
      UserPoolId: environment.userPoolId, // Zamijenite 'your-user-pool-id' sa ID-om vašeg User Pool-a
      ClientId: environment.userPoolClientId       // Zamijenite 'your-client-id' sa ID-om vašeg Cognito Client-a
    };
    
    const userPool1 = new CognitoUserPool(poolData1);
    const userData = {
      Username: sub, // Sub identifikator korisnika za koga želite da dobijete informacije
      Pool: this.userPool
  };

  const cognitoUser = new CognitoUser(userData); // Ispravno kreiranje CognitoUser objekta
  if (cognitoUser.getSignInUserSession() !== null)
  cognitoUser.getUserAttributes((err, attributes) => {
      if (err) {
          console.error('Error fetching user attributes:', err);
          return;
      }
      if (attributes)
      // Traženje korisničkog imena (username)
      for (let attribute of attributes) {
          if (attribute.getName() === 'sub') {
              console.log('Username:', attribute.getValue());
              break;
          }
      }
  });
}
 }

