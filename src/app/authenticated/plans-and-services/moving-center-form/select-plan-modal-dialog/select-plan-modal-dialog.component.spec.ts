import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPlanModalDialogComponent } from './select-plan-modal-dialog.component';

describe('SelectPlanModalDialogComponent', () => {
  let component: SelectPlanModalDialogComponent;
  let fixture: ComponentFixture<SelectPlanModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPlanModalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPlanModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
