import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyBillComponent } from './view-my-bill.component';

describe('ViewMyBillComponent', () => {
  let component: ViewMyBillComponent;
  let fixture: ComponentFixture<ViewMyBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMyBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMyBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
