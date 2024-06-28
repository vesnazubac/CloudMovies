import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsReportingOwnersComponent } from './guests-reporting-owners.component';

describe('GuestsReportingOwnersComponent', () => {
  let component: GuestsReportingOwnersComponent;
  let fixture: ComponentFixture<GuestsReportingOwnersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestsReportingOwnersComponent]
    });
    fixture = TestBed.createComponent(GuestsReportingOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
