import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityInformationComponent } from './security-information.component';

describe('SecurityInformationComponent', () => {
  let component: SecurityInformationComponent;
  let fixture: ComponentFixture<SecurityInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
