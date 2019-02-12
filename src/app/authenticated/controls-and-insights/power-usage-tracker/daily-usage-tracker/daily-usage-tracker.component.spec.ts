import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyUsageTrackerComponent } from './daily-usage-tracker.component';

describe('DailyUsageTrackerComponent', () => {
  let component: DailyUsageTrackerComponent;
  let fixture: ComponentFixture<DailyUsageTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyUsageTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyUsageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
