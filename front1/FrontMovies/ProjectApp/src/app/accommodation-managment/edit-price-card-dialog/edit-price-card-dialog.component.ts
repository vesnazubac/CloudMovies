import { Component, Inject ,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { PriceCard } from 'src/app/accommodation/accommodation/model/priceCard.model';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { PriceTypeEnum } from 'src/app/models/enums/priceTypeEnum';
@Component({
  selector: 'app-edit-price-card-dialog',
  templateUrl: 'edit-price-card-dialog.component.html',
  styleUrls: ['./edit-price-card-dialog.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule,MatNativeDateModule,MatDatepickerModule,MatInputModule,MatButtonModule,CommonModule,MatFormFieldModule,MatSnackBarModule,MatRadioModule]
})
export class EditPriceCardDialogComponent  implements OnInit {
  element:PriceCard;
  form:FormGroup;
  constructor(private snackBar:MatSnackBar,public dialogRef: MatDialogRef<EditPriceCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {element:PriceCard},
    private fb: FormBuilder
  ) {  }

  ngOnInit(): void {
    this.form = this.fb.group({
      startDateEdit: [null],
      endDateEdit: [null],
      priceEdit: [null],
    priceTypeEdit:[null],});

    this.element = this.data.element;
    if (this.data && this.data.element && this.data.element.timeSlot) {
      const startDate = this.data.element.timeSlot.startDate;
      const endDate = this.data.element.timeSlot.endDate;
      const price = this.data.element.price;
      const priceType=this.data.element.type;
  
      this.form.patchValue({
        startDateEdit: startDate,
        endDateEdit: endDate,
        priceEdit: price,
        priceTypeEdit:priceType,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  onSaveClick(): void {
    const updatedValues = this.form.value;

    const startDate=new Date(this.form.value.startDateEdit);
    const endDate=new Date(this.form.value.endDateEdit);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate >= endDate) {
      this.openSnackBar('Start date must be before end date.');
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    if (startDate <= today || endDate <= today) {
      this.openSnackBar('Selected dates must be in the future.');
      return;
    }

    if (isNaN(this.form.get('priceEdit')?.value) || this.form.get('priceEdit')?.value==null) {
      this.openSnackBar('Price field is required number.');
      return;
    }

    this.element.timeSlot.startDate = updatedValues.startDateEdit;
    this.element.timeSlot.endDate = updatedValues.endDateEdit;
    this.element.price = updatedValues.priceEdit;
    this.element.type=updatedValues.priceTypeEdit;
  
    this.dialogRef.close(this.element);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
