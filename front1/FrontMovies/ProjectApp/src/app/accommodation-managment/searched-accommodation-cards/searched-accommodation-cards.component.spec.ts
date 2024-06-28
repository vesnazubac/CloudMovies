import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedAccommodationCardsComponent } from './searched-accommodation-cards.component';

describe('SearchedAccommodationCardsComponent', () => {
  let component: SearchedAccommodationCardsComponent;
  let fixture: ComponentFixture<SearchedAccommodationCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchedAccommodationCardsComponent]
    });
    fixture = TestBed.createComponent(SearchedAccommodationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
