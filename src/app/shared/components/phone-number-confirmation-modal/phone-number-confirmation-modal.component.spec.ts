import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberConfirmationModalComponent } from './phone-number-confirmation-modal.component';

describe('PhoneNumberConfirmationModalComponent', () => {
  let component: PhoneNumberConfirmationModalComponent;
  let fixture: ComponentFixture<PhoneNumberConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneNumberConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
