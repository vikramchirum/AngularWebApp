import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingCenterFormComponent } from './moving-center-form.component';

describe('MovingCenterFormComponent', () => {
  let component: MovingCenterFormComponent;
  let fixture: ComponentFixture<MovingCenterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingCenterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingCenterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
