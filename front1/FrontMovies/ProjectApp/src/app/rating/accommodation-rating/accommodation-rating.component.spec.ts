import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationRatingComponent } from './accommodation-rating.component';

describe('AccommodationRatingComponent', () => {
  let component: AccommodationRatingComponent;
  let fixture: ComponentFixture<AccommodationRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccommodationRatingComponent]
    });
    fixture = TestBed.createComponent(AccommodationRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
