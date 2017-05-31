import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeYourPlanComponent } from './change-your-plan.component';

describe('ChangeYourPlanComponent', () => {
  let component: ChangeYourPlanComponent;
  let fixture: ComponentFixture<ChangeYourPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeYourPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeYourPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
