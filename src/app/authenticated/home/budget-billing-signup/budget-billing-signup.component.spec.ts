import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBillingSignupComponent } from './budget-billing-signup.component';

describe('BudgetBillingSignupComponent', () => {
  let component: BudgetBillingSignupComponent;
  let fixture: ComponentFixture<BudgetBillingSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBillingSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBillingSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
