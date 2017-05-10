import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveHamburgerMenuComponent } from './responsive-hamburger-menu.component';

describe('ResponsiveHamburgerMenuComponent', () => {
  let component: ResponsiveHamburgerMenuComponent;
  let fixture: ComponentFixture<ResponsiveHamburgerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveHamburgerMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveHamburgerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
