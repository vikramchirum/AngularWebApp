import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAddClaimsModalComponent } from './login-add-claims-modal.component';

describe('LoginAddClaimsModalComponent', () => {
  let component: LoginAddClaimsModalComponent;
  let fixture: ComponentFixture<LoginAddClaimsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAddClaimsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAddClaimsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
