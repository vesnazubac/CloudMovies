import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteAccommodationsComponent } from './favourite-accommodations.component';

describe('FavouriteAccommodationsComponent', () => {
  let component: FavouriteAccommodationsComponent;
  let fixture: ComponentFixture<FavouriteAccommodationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouriteAccommodationsComponent]
    });
    fixture = TestBed.createComponent(FavouriteAccommodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
