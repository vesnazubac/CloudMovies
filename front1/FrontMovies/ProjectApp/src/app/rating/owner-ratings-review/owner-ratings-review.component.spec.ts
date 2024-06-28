import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRatingsReviewComponent } from './owner-ratings-review.component';

describe('OwnerRatingsReviewComponent', () => {
  let component: OwnerRatingsReviewComponent;
  let fixture: ComponentFixture<OwnerRatingsReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerRatingsReviewComponent]
    });
    fixture = TestBed.createComponent(OwnerRatingsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
