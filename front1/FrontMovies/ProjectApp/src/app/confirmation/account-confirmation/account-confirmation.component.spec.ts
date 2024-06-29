import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfirmationComponent } from './account-confirmation.component';

describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountConfirmationComponent]
    });
    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
