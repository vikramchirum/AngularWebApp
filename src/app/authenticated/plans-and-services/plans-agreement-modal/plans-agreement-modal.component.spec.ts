import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansAgreementModalComponent } from './plans-agreement-modal.component';

describe('PlansAgreementModalComponent', () => {
  let component: PlansAgreementModalComponent;
  let fixture: ComponentFixture<PlansAgreementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlansAgreementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansAgreementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
