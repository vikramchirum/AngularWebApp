import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitMoveComponent } from './submit-move.component';

describe('SubmitMoveComponent', () => {
  let component: SubmitMoveComponent;
  let fixture: ComponentFixture<SubmitMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
