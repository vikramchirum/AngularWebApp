import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymethodSelectorComponent } from './payment-method-selector.component';

describe('PaymethodSelectorComponent', () => {
  let component: PaymethodSelectorComponent;
  let fixture: ComponentFixture<PaymethodSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymethodSelectorComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
