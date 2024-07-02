import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { UserService } from 'src/app/user.service';
import { UserPostDTO } from 'src/app/models/userPostDTO.model';
import { environment } from 'src/env/env';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { ViewChild, ElementRef } from '@angular/core';
import { Login } from 'src/app/auth/model/login.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthResponse } from 'src/app/auth/model/auth-resposne.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone:true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,MatIconModule,MatButtonModule,MatSelectModule,
    MatSlideToggleModule,CommonModule,MatDatepickerModule]
})
export class RegisterFormComponent {
  hide: boolean = true; // Hide/show password toggle

  createRegisterForm = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]) ,
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required)
  });

  constructor(private cdr: ChangeDetectorRef, private userService: UserService, private router: Router, private snackBar: MatSnackBar,private httpClient: HttpClient) {}

  navigateToHome() {
    this.router.navigate(['home']);
  }

  formatBirthdate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  register() {
    if(this.createRegisterForm.value.birthdate){
      
    }
    const user: UserPostDTO = {
      firstName: this.createRegisterForm.value.name,
      lastName: this.createRegisterForm.value.surname,
      username: this.createRegisterForm.value.username ?? '',
      password: this.createRegisterForm.value.password,
      birthdate: this.createRegisterForm.value.birthdate ? this.formatBirthdate(this.createRegisterForm.value.birthdate) : undefined,
      email: this.createRegisterForm.value.username ?? ''
    };

    // Initialize attribute list
    const attributeList: CognitoUserAttribute[] = [];

    // Add email attribute
    if (user.email) {
      const emailAttribute = new CognitoUserAttribute({ Name: 'email', Value: user.email.toString() });
      attributeList.push(emailAttribute);
    }

    // Add given name attribute
    if (user.firstName) {
      const givenNameAttribute = new CognitoUserAttribute({ Name: 'given_name', Value: user.firstName });
      attributeList.push(givenNameAttribute);
    }

    // Add family name attribute
    if (user.lastName) {
      const familyNameAttribute = new CognitoUserAttribute({ Name: 'family_name', Value: user.lastName });
      attributeList.push(familyNameAttribute);
    }

    // Add birthdate attribute
    if (user.birthdate) {
      console.log(user.birthdate)
      const birthdateAttribute = new CognitoUserAttribute({ Name: 'birthdate', Value: user.birthdate });
      attributeList.push(birthdateAttribute);
    }

    // Initialize Cognito User Pool with your pool data
    const poolData = {
      UserPoolId: environment.userPoolId, // Replace with your actual User Pool ID
      ClientId: environment.userPoolClientId // Replace with your actual App Client ID
    };
    const userPool = new CognitoUserPool(poolData);

    // Register the user in Cognito User Pool
    if(user.username && user.password){
      userPool.signUp(user.username, user.password, attributeList.length > 0 ? attributeList : [], [], (err, result) => {
        if (err) {
          console.error('Error occurred during registration:', err);
          this.openErrorSnackBar('Failed to register user. Please try again.');
          return;
        }
        if(user.username)
          this.addUserToGroup(user.username, 'Users');

        console.log('User registered successfully:', result?.user);
        //this.navigateToHome(); // Example navigation to home page after successful registration
        this.router.navigate(['verifyAccount',user.username])
      });
    }
   

  }

  

  addUserToGroup(username: string, groupName: string) {
    const payload = { userName: username, group_name: groupName, poolId: environment.userPoolId};
    this.httpClient.post(environment.cloudHost + 'addUserToGroup', payload)
      .subscribe(response => {
        console.log('User added to group successfully');
      }, error => {
        console.error('Failed to add user to group', error);
      });
}

  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  get isFormValid(): boolean {
    return this.createRegisterForm.valid;
  }
}
