import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersAccommodationsComponent } from './owners-accommodations.component';

describe('OwnersAccommodationsComponent', () => {
  let component: OwnersAccommodationsComponent;
  let fixture: ComponentFixture<OwnersAccommodationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnersAccommodationsComponent]
    });
    fixture = TestBed.createComponent(OwnersAccommodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
