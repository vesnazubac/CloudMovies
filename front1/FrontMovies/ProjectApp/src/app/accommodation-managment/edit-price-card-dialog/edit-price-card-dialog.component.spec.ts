import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceCardDialogComponent } from './edit-price-card-dialog.component';

describe('EditPriceCardDialogComponent', () => {
  let component: EditPriceCardDialogComponent;
  let fixture: ComponentFixture<EditPriceCardDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPriceCardDialogComponent]
    });
    fixture = TestBed.createComponent(EditPriceCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
