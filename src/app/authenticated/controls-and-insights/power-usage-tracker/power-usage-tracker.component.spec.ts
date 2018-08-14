import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUsageTrackerComponent } from './power-usage-tracker.component';

describe('PowerUsageTrackerComponent', () => {
  let component: PowerUsageTrackerComponent;
  let fixture: ComponentFixture<PowerUsageTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerUsageTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerUsageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
