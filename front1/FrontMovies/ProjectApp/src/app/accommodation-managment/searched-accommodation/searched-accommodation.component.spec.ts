import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedAccommodationComponent } from './searched-accommodation.component';

describe('SearchedAccommodationComponent', () => {
  let component: SearchedAccommodationComponent;
  let fixture: ComponentFixture<SearchedAccommodationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchedAccommodationComponent]
    });
    fixture = TestBed.createComponent(SearchedAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
