import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRewardPreferencesComponent } from './my-reward-preferences.component';

describe('MyRewardPreferencesComponent', () => {
  let component: MyRewardPreferencesComponent;
  let fixture: ComponentFixture<MyRewardPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRewardPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRewardPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
