import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingServiceModalDialogComponent } from './moving-service-modal-dialog.component';

describe('MovingServiceModalDialogComponent', () => {
  let component: MovingServiceModalDialogComponent;
  let fixture: ComponentFixture<MovingServiceModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingServiceModalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingServiceModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
