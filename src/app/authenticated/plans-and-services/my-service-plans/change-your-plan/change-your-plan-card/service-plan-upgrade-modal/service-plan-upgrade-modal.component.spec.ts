import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePlanUpgradeModalComponent } from './service-plan-upgrade-modal.component';

describe('ServicePlanUpgradeModalComponent', () => {
  let component: ServicePlanUpgradeModalComponent;
  let fixture: ComponentFixture<ServicePlanUpgradeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePlanUpgradeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePlanUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
