import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCurrentPlanComponent } from './my-current-plan.component';

describe('MyCurrentPlanComponent', () => {
  let component: MyCurrentPlanComponent;
  let fixture: ComponentFixture<MyCurrentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCurrentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCurrentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
