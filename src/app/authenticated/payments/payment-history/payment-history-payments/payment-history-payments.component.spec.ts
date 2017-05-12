import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryPaymentsComponent } from './payment-history-payments.component';

describe('PaymentHistoryPaymentsComponent', () => {
  let component: PaymentHistoryPaymentsComponent;
  let fixture: ComponentFixture<PaymentHistoryPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
