import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNotificationsComponent } from './users-notifications.component';

describe('UsersNotificationsComponent', () => {
  let component: UsersNotificationsComponent;
  let fixture: ComponentFixture<UsersNotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersNotificationsComponent]
    });
    fixture = TestBed.createComponent(UsersNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
