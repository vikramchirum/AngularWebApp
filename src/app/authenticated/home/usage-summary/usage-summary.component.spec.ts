import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageSummaryComponent } from './usage-summary.component';

describe('UsageSummaryComponent', () => {
  let component: UsageSummaryComponent;
  let fixture: ComponentFixture<UsageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
