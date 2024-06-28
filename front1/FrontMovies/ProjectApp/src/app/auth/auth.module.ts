import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login/login-form/login-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { MaterialModule } from '../infrastructure/material/material.module';

@NgModule({
  declarations: [
   // LoginFormComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
       
    ]
})
export class AuthModule { }
