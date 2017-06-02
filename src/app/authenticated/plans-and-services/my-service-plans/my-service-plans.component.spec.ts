import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyServicePlansComponent } from './my-service-plans.component';

describe('MyServicePlansComponent', () => {
  let component: MyServicePlansComponent;
  let fixture: ComponentFixture<MyServicePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyServicePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyServicePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
