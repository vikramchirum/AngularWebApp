import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { OfferService } from '../../../../core/offer.service';

@Component({
  selector: 'mygexa-select-plan-modal-dialog',
  templateUrl: './select-plan-modal-dialog.component.html',
  styleUrls: ['./select-plan-modal-dialog.component.scss'],
  providers: [OfferService]
})
export class SelectPlanModalDialogComponent implements OnInit {


  @ViewChild('selectPlanModal') public selectPlanModal: ModalDirective;
  constructor(private offerService: OfferService) { }

  ngOnInit() {
     this.getOffersByTduDunsNumber();
  }

  getOffersByTduDunsNumber(){
      this.offerService.getOffers(123234)
      .subscribe(availablePlans => {
        console.log("available plans", availablePlans );
      })
  }
 

  public show(): void {
    this.selectPlanModal.show();
  }

  public hideMovingServiceModal(): void {
    this.selectPlanModal.hide();
  }
}
