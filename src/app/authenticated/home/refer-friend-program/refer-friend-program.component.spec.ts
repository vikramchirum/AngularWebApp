import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferFriendProgramComponent } from './refer-friend-program.component';

describe('ReferFriendProgramComponent', () => {
  let component: ReferFriendProgramComponent;
  let fixture: ComponentFixture<ReferFriendProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferFriendProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferFriendProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
