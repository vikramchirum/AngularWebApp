import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
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
  @Output() selectedPlan: EventEmitter<any> =  new EventEmitter<any>();

  public availablePlans = null;
  constructor(private offerService: OfferService) { }

  ngOnInit() {
     this.getOffersByTduDunsNumber();
  }

  getOffersByTduDunsNumber(){
      this.offerService.getOffers(123234)
      .subscribe(result => {
        console.log("available plans", result );
        this.availablePlans = result;
        console.log("items", this.availablePlans.Items)
      })
  }
 

  public show(): void {
    this.selectPlanModal.show();
  }

  public hideMovingServiceModal(): void {
    this.selectPlanModal.hide();
  }

  selectPlan(offers) {
   this.selectedPlan.emit(offers);
   this.selectPlanModal.hide();
  }
}
