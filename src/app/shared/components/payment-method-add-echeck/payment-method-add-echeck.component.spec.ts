import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymethodAddEcheckComponent } from './payment-method-add-echeck.component';

describe('PaymethodAddEcheckComponent', () => {
  let component: PaymethodAddEcheckComponent;
  let fixture: ComponentFixture<PaymethodAddEcheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymethodAddEcheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodAddEcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
