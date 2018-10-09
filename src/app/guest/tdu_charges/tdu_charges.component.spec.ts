import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TduChargesComponent } from './tdu_charges.component';

describe('RecoverPasswordComponent', () => {
  let component: TduChargesComponent;
  let fixture: ComponentFixture<TduChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TduChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TduChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
