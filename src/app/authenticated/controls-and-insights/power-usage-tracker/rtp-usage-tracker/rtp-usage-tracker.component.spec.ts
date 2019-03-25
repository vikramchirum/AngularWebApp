import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtpUsageTrackerComponent } from './rtp-usage-tracker.component';

describe('RtpUsageTrackerComponent', () => {
  let component: RtpUsageTrackerComponent;
  let fixture: ComponentFixture<RtpUsageTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtpUsageTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtpUsageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
