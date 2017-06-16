import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageHistoryComponent } from './usage-history.component';

describe('UsageHistoryComponent', () => {
  let component: UsageHistoryComponent;
  let fixture: ComponentFixture<UsageHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
