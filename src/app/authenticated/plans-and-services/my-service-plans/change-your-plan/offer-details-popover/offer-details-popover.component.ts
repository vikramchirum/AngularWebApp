import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverDirective} from 'ngx-bootstrap';


@Component({
  selector: 'mygexa-offer-details-popover',
  templateUrl: './offer-details-popover.component.html',
  styleUrls: ['./offer-details-popover.component.scss']
})
export class OfferDetailsPopoverComponent implements OnInit {
@ViewChild('pop') public pop: PopoverDirective;
  constructor() { }

  ngOnInit() {
  }

}
