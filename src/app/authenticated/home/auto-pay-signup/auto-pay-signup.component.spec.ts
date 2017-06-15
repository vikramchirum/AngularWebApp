import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoPaySignupComponent } from './auto-pay-signup.component';

describe('AutoPaySignupComponent', () => {
  let component: AutoPaySignupComponent;
  let fixture: ComponentFixture<AutoPaySignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoPaySignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoPaySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
