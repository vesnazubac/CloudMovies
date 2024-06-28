import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowReviewsComponent } from './owner-show-reviews.component';

describe('OwnerShowReviewsComponent', () => {
  let component: OwnerShowReviewsComponent;
  let fixture: ComponentFixture<OwnerShowReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerShowReviewsComponent]
    });
    fixture = TestBed.createComponent(OwnerShowReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
