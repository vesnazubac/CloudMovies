import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/env/env';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule]
})
export class LoginFormComponent {
  hide: boolean = true;
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

          cognitoUser.getSession((err:any, session:any) => {
            if (err) {
              console.error('Error getting session:', err);
              return;
            }

            if (session) {
              // Dobijanje idToken-a iz CognitoUserSession
              const idToken = session.getIdToken().getJwtToken();
              console.log('idToken:', idToken);

              // Čuvanje idToken-a u localStorage
              localStorage.setItem('idToken', idToken);
              console.log('Stored idToken in localStorage:', idToken);
              
              const groups = session.getIdToken().payload['cognito:groups'];
              console.log('User groups:', groups);

              localStorage.setItem('Group',groups);

              const username = session.getIdToken().payload['email'];
              console.log('Username : ',username)
            
              this.router.navigate(["/home"])
            }
          });
        },
        onFailure: (err) => {
          console.error('Login failed:', err);
        }
      });
    }
  }

  register() {
    this.router.navigate(['register']);
  }

  // Funkcija za dobijanje korisničkog imena na osnovu sub identifikatora
  getUsernameFromSub(sub: string) {
    const poolData = {
      UserPoolId: environment.userPoolId,
      ClientId: environment.userPoolClientId
    };

    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: sub,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.getUserAttributes((err, attributes) => {
      if (err) {
        console.error('Error fetching user attributes:', err);
        return;
      }

      // Traženje korisničkog imena (username)
      if (attributes) {
        for (let attribute of attributes) {
          if (attribute.getName() === 'sub') {
            console.log('Username:', attribute.getValue());
            break;
          }
        }
      }
    });
  }
}


