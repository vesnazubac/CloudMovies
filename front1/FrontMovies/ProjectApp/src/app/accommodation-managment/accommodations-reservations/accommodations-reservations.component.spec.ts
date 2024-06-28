import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationsReservationsComponent } from './accommodations-reservations.component';

describe('AccommodationsReservationsComponent', () => {
  let component: AccommodationsReservationsComponent;
  let fixture: ComponentFixture<AccommodationsReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccommodationsReservationsComponent]
    });
    fixture = TestBed.createComponent(AccommodationsReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
