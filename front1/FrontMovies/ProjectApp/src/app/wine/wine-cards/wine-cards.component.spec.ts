import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WineCardsComponent } from './wine-cards.component';

describe('WineCardsComponent', () => {
  let component: WineCardsComponent;
  let fixture: ComponentFixture<WineCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WineCardsComponent]
    });
    fixture = TestBed.createComponent(WineCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
