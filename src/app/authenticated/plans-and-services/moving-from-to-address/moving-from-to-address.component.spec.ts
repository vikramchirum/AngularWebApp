import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingFromToAddressComponent } from './moving-from-to-address.component';

describe('MovingFromToAddressComponent', () => {
  let component: MovingFromToAddressComponent;
  let fixture: ComponentFixture<MovingFromToAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingFromToAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingFromToAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
