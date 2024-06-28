import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerRatingComponent } from './owner-rating.component';

describe('OwnerRatingComponent', () => {
  let component: OwnerRatingComponent;
  let fixture: ComponentFixture<OwnerRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerRatingComponent]
    });
    fixture = TestBed.createComponent(OwnerRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
