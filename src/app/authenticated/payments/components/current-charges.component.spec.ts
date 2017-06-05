import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentChargesComponent } from './current-charges.component';

describe('CurrentChargesComponent', () => {
  let component: CurrentChargesComponent ;
  let fixture: ComponentFixture<CurrentChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentChargesComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
