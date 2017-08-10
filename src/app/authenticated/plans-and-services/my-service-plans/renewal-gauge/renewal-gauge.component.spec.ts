import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalGaugeComponent } from './renewal-gauge.component';

describe('RenewalGaugeComponent', () => {
  let component: RenewalGaugeComponent;
  let fixture: ComponentFixture<RenewalGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalGaugeComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
