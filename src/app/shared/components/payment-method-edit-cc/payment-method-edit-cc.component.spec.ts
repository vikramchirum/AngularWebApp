import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodEditCcComponent } from './payment-method-edit-cc.component';

describe('PaymentMethodEditCcComponent', () => {
  let component: PaymentMethodEditCcComponent;
  let fixture: ComponentFixture<PaymentMethodEditCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodEditCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodEditCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
