import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperlessBillingSignupComponent } from './paperless-billing-signup.component';

describe('PaperlessBillingSignupComponent', () => {
  let component: PaperlessBillingSignupComponent;
  let fixture: ComponentFixture<PaperlessBillingSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperlessBillingSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperlessBillingSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
