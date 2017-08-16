import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanConfirmationPopoverComponent } from './plan-confirmation-popover.component';

describe('PlanConfirmationPopoverComponent', () => {
  let component: PlanConfirmationPopoverComponent;
  let fixture: ComponentFixture<PlanConfirmationPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanConfirmationPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanConfirmationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
