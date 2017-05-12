import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryBillsComponent } from './payment-history-bills.component';

describe('PaymentHistoryBillsComponent', () => {
  let component: PaymentHistoryBillsComponent;
  let fixture: ComponentFixture<PaymentHistoryBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
