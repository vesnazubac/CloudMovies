import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationRatingsReviewComponent } from './accommodation-ratings-review.component';

describe('AccommodationRatingsReviewComponent', () => {
  let component: AccommodationRatingsReviewComponent;
  let fixture: ComponentFixture<AccommodationRatingsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccommodationRatingsReviewComponent]
    });
    fixture = TestBed.createComponent(AccommodationRatingsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
