import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentExtensionComponent } from './payment-extension.component';

describe('PaymentExtensionComponent', () => {
  let component: PaymentExtensionComponent;
  let fixture: ComponentFixture<PaymentExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
