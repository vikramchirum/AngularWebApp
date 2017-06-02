import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBillingComponent } from './budget-billing.component';

describe('BudgetBillingComponent', () => {
  let component: BudgetBillingComponent;
  let fixture: ComponentFixture<BudgetBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
