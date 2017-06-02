import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingServiceComponent } from './moving-service.component';

describe('MovingServiceComponent', () => {
  let component: MovingServiceComponent;
  let fixture: ComponentFixture<MovingServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
