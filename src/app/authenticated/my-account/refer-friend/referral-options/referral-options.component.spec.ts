import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralOptionsComponent } from './referral-options.component';

describe('ReferralOptionsComponent', () => {
  let component: ReferralOptionsComponent;
  let fixture: ComponentFixture<ReferralOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
