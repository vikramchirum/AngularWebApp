import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodAddCcComponent } from './payment-method-add-cc.component';

describe('PaymentMethodAddCcComponent', () => {
  let component: PaymentMethodAddCcComponent;
  let fixture: ComponentFixture<PaymentMethodAddCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodAddCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodAddCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
