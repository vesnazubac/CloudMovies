import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    EditAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AccountmanagementModule { }
