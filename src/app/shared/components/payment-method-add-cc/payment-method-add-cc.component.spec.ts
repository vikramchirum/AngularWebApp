import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymethodAddCcComponent } from './payment-method-add-cc.component';

describe('PaymethodAddCcComponent', () => {
  let component: PaymethodAddCcComponent;
  let fixture: ComponentFixture<PaymethodAddCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymethodAddCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodAddCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
