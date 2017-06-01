import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoBillPaymentComponent } from './auto-bill-payment.component';

describe('AutoBillPaymentComponent', () => {
  let component: AutoBillPaymentComponent;
  let fixture: ComponentFixture<AutoBillPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoBillPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoBillPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
