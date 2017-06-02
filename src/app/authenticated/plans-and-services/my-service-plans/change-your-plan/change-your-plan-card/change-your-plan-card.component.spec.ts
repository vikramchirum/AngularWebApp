import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeYourPlanCardComponent } from './change-your-plan-card.component';

describe('ChangeYourPlanCardComponent', () => {
  let component: ChangeYourPlanCardComponent;
  let fixture: ComponentFixture<ChangeYourPlanCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeYourPlanCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeYourPlanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
