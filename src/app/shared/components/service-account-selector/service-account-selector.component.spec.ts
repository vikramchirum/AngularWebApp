import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAccountSelectorComponent } from './service-account-selector.component';

describe('ServiceAccountSelectorComponent', () => {
  let component: ServiceAccountSelectorComponent;
  let fixture: ComponentFixture<ServiceAccountSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceAccountSelectorComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAccountSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
