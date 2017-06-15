import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNavPanelComponent } from './left-nav-panel.component';

describe('LeftNavPanelComponent', () => {
  let component: LeftNavPanelComponent;
  let fixture: ComponentFixture<LeftNavPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftNavPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftNavPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
