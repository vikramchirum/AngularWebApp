import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap';

import { IOffers} from '../../../../../core/models/offers/offers.model';
import { ServiceAccount } from '../../../../../core/models/serviceaccount/serviceaccount.model';
import { DocumentsService } from '../../../../../core/documents.service';

@Component({
  selector: 'mygexa-offer-details-popover',
  templateUrl: './offer-details-popover.component.html',
  styleUrls: ['./offer-details-popover.component.scss']
})
export class OfferDetailsPopoverComponent implements OnInit, OnChanges {
 @ViewChild('pop') public pop: PopoverDirective;
 @Input() OfferDetails: IOffers;
 @Input() ActiveOfferDetails: ServiceAccount;
 @Input() IsCurrentPlanPopOver: boolean;

 public eflLink;
 public tosLink;
 public yraacLink;

  constructor(private documentsService: DocumentsService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['ActiveOfferDetails']) {

      let docId = '';
      if (this.ActiveOfferDetails.Current_Offer.IsLegacyOffer) {
        docId = this.ActiveOfferDetails.Current_Offer.Rate_Code;
      } else {
        docId = this.ActiveOfferDetails.Current_Offer.Client_Key;
      }

      this.eflLink = this.documentsService.getEFLLink(docId);
      this.tosLink = this.documentsService.getTOSLink(this.ActiveOfferDetails.Current_Offer.IsFixed);
      this.yraacLink = this.documentsService.getYRAACLink();

    } else if (changes['OfferDetails']) {

      this.eflLink = this.documentsService.getEFLLink(this.OfferDetails.Id);
      this.tosLink = this.documentsService.getTOSLink(this.OfferDetails.Plan.Product.Fixed);
      this.yraacLink = this.documentsService.getYRAACLink();

    }
  }
}
