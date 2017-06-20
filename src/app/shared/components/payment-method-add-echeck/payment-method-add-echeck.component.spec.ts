import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodAddEcheckComponent } from './payment-method-add-echeck.component';

describe('PaymentMethodAddEcheckComponent', () => {
  let component: PaymentMethodAddEcheckComponent;
  let fixture: ComponentFixture<PaymentMethodAddEcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodAddEcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodAddEcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
