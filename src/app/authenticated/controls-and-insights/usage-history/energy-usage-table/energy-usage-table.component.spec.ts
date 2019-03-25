import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyUsageTableComponent } from './energy-usage-table.component';

describe('EnergyUsageTableComponent', () => {
  let component: EnergyUsageTableComponent;
  let fixture: ComponentFixture<EnergyUsageTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyUsageTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyUsageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
