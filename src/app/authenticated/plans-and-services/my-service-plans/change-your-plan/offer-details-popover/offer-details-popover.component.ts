import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PopoverDirective} from 'ngx-bootstrap';
import {IOffers} from '../../../../../core/models/offers/offers.model';
import {ServiceAccountService} from '../../../../../core/serviceaccount.service';
import {Subscription} from 'rxjs/Subscription';
import {ServiceAccount} from '../../../../../core/models/serviceaccount/serviceaccount.model';


@Component({
  selector: 'mygexa-offer-details-popover',
  templateUrl: './offer-details-popover.component.html',
  styleUrls: ['./offer-details-popover.component.scss']
})
export class OfferDetailsPopoverComponent implements OnInit {
@ViewChild('pop') public pop: PopoverDirective;
@Input() OfferDetails: IOffers;
@Input() ActiveOfferDetails: ServiceAccount;
@Input() IsCurrentPlanPopOver: boolean;
  constructor(private serviceAccountService: ServiceAccountService) {
  }

  ngOnInit() {
  }

}
