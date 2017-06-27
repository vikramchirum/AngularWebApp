import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMultiAccountsModalComponent } from './home-multi-accounts-modal.component';

describe('HomeMultiAccountsModalComponent', () => {
  let component: HomeMultiAccountsModalComponent;
  let fixture: ComponentFixture<HomeMultiAccountsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMultiAccountsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMultiAccountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
