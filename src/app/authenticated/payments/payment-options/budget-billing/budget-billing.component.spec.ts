import { async, ComponentFixture, TestBed } from '@angular/core/testing';


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

describe('BudgetBillingSelectorComponent', () => {
  let component: BudgetBillingSelectorComponent;
  let fixture: ComponentFixture<BudgetBillingSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetBillingSelectorComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetBillingSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
