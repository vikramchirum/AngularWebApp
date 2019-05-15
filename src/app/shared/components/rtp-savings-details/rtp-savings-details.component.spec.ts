import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtpSavingsDetailsComponent } from './rtp-savings-details.component';

describe('RtpSavingsDetailsComponent', () => {
  let component: RtpSavingsDetailsComponent;
  let fixture: ComponentFixture<RtpSavingsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtpSavingsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtpSavingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
