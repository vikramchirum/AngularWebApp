import { Component, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'mygexa-offer-details-popover',
  templateUrl: './offer-details-popover.component.html',
  styleUrls: ['./offer-details-popover.component.scss']
})
export class OfferDetailsPopoverComponent implements OnInit {
  @Input() offerDetails;
  constructor() { }

  ngOnInit() {
  }

}
