import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUsageComponent } from './my-usage.component';

describe('MyUsageComponent', () => {
  let component: MyUsageComponent;
  let fixture: ComponentFixture<MyUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
