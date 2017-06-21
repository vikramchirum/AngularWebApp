import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingCenterComponent } from './moving-center.component';

describe('MovingCenterComponent', () => {
  let component: MovingCenterComponent;
  let fixture: ComponentFixture<MovingCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
