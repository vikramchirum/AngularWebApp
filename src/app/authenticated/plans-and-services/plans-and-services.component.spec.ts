import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansAndServicesComponent } from './plans-and-services.component';

describe('PlansAndServicesComponent', () => {
  let component: PlansAndServicesComponent;
  let fixture: ComponentFixture<PlansAndServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlansAndServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansAndServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
