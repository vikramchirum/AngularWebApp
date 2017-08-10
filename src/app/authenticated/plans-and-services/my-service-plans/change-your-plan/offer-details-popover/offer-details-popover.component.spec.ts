import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailsPopoverComponent } from './offer-details-popover.component';

describe('OfferDetailsPopoverComponent', () => {
  let component: OfferDetailsPopoverComponent;
  let fixture: ComponentFixture<OfferDetailsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDetailsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
