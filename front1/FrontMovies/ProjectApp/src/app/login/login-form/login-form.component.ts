import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/auth/model/login.model';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthResponse } from 'src/app/auth/model/auth-resposne.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SocketApiService } from 'src/app/models/socketApiService.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone:true,
  imports:[MatFormFieldModule, MatInputModule, MatIconModule,MatButtonModule,MatIconModule,ReactiveFormsModule,
  MatSnackBarModule]
  
})

export class LoginFormComponent {

  private stompSubscription: Subscription;

  constructor(private authService: AuthService,
    private router: Router,private snackBar: MatSnackBar,private socketApiService:SocketApiService) {}

  hide=true;
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  })
  
  navigateToHome() {

    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

    console.log('Username:', username);
    console.log('Password:', password);
    // ...
    this.router.navigate(['home']);

    
  }

  login(): void {
    console.log("USAOOOO LOGGGG VESNA")
    if(this.loginForm.valid) {
      const login: Login = {
        username: this.loginForm.value.username || "",
        password: this.loginForm.value.password || ""
      }
      //console.log("USAOOOO LOGGGG VESNICCAAAAAAA 57")
      this.authService.login(login).subscribe({
        next: (response: AuthResponse) => {
          localStorage.setItem('user', response.jwt);
          this.authService.setUser()
          //this.socketApiService.sendUserIdOnLogin( this.loginForm.value.username);
          // this.socketApiService.getStompClient().subscribe("/socket-publisher/" + this.loginForm.value.username).subscribe((message: any) => {
          //   // Ovde rukujete pristiglim porukama
          //   console.log("Primljena poruka:", message);
          // });
          // this.stompSubscription = this.socketApiService.getStompClient().subscribe((stompClient) => {
          //   if (stompClient) {
          //     stompClient.subscribe("/socket-publisher/" + this.loginForm.value.username).subscribe((message: any) => {
          //       // Handle incoming messages here
          //       console.log("Received message:", message);
          //     });
          //   }
          // });

          // this.socketApiService.getStompClient().subscribe((stompClient) => {
          //   if (stompClient) {
          //     stompClient.subscribe("/socket-publisher/" + this.loginForm.value.username, (message: any) => {
          //       // Handle incoming messages here
          //       console.log("Received message:", message);
          //     });
          //   }
          // });
        //   this.stompSubscription = this.socketApiService.getStompClient().subscribe((stompClient)=> {
        //     console.log("USAO OVDE KAO")
        //     if (stompClient) {
             
        //         this.stompSubscription = stompClient.subscribe("/socket-publisher/" + this.loginForm.value.username, (message: any) => {
        //             // Handle incoming messages here
        //             console.log("Received message:", message);
        //         });
        //     }
        // });
        // console.log("Before if block");

        // this.stompSubscription = this.socketApiService.getStompClient().subscribe((stompClient) => {
        //   console.log("USAO OVDE KAO")
    
        //       this.stompSubscription = stompClient.subscribe("/socket-publisher/" + this.loginForm.value.username, (message: any) => {
        //         console.log("Received message:", message);
        //       });
          
        // });
        // console.log("USAO 112")
        // const stompClient = this.socketApiService.getStompClient();
        // const username :String=this.loginForm.value.username
        // console.log(stompClient)
        // stompClient.subscribe((stompClient) => {
        //     console.log("EH")
        //       //stompClient.subscribe("/socket-publisher/" + this.loginForm.value.username , (message: any) => {
        //         // Handle incoming messages here
        //         this.socketApiService.openGlobalSocket()
        //        // console.log("Received message:", message);
        //       });
            
       

       //this.socketApiService.setUsername(this.loginForm.value.username)
        this.socketApiService.openSocket(this.loginForm.value.username);
     
          this.router.navigate(['home'])
        },
        error:()=>{

          console.error('Failed to login ');
          this.snackBar.open('Failed login. Please check the username and password', 'Close', {
            duration: 5000, 
          });
        }
      })
    }
  }


  register(){
    this.router.navigate(['register'])
  }
}
