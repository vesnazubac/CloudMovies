import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRatingRequestsComponent } from './admin-rating-requests.component';

describe('AdminRatingRequestsComponent', () => {
  let component: AdminRatingRequestsComponent;
  let fixture: ComponentFixture<AdminRatingRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRatingRequestsComponent]
    });
    fixture = TestBed.createComponent(AdminRatingRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
