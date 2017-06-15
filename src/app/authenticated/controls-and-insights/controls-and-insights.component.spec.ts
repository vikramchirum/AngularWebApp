import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsAndInsightsComponent } from './controls-and-insights.component';

describe('ControlsAndInsightsComponent', () => {
  let component: ControlsAndInsightsComponent;
  let fixture: ComponentFixture<ControlsAndInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlsAndInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsAndInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
