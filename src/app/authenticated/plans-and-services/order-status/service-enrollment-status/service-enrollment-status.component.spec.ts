import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEnrollmentStatusComponent } from './service-enrollment-status.component';

describe('ServiceEnrollmentStatusComponent', () => {
  let component: ServiceEnrollmentStatusComponent;
  let fixture: ComponentFixture<ServiceEnrollmentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceEnrollmentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEnrollmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
