import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';


import { PlanConfirmationPopoverComponent } from 'app/authenticated/plans-and-services/my-service-plans/plan-confirmation-popover/plan-confirmation-popover.component';


@Component({
  selector: 'mygexa-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {

  @Input() featuredOffer;
  @ViewChild('planPopModal') public planPopModal: PlanConfirmationPopoverComponent;

  @Output() selectedOffer: EventEmitter<any> = new EventEmitter<any>();


  selectCheckBox = false;
  public Price_atFeatured_Usage_Level: number;
  enableSelect = false;

  constructor() { }

  ngOnInit() {
    if (this.featuredOffer.Plan.Product.Featured_Usage_Level != null) {
      switch (this.featuredOffer.Plan.Product.Featured_Usage_Level) {
        case  '500 kWh': {
          this.Price_atFeatured_Usage_Level = this.featuredOffer.Price_At_500_kwh;
          break;
        }
        case  '1000 kWh': {
          this.Price_atFeatured_Usage_Level = this.featuredOffer.Price_At_1000_kwh;
          break;
        }
        case  '2000 kWh': {
          this.Price_atFeatured_Usage_Level = this.featuredOffer.Price_At_2000_kwh;
          break;
        }
        default: {
          this.featuredOffer.Plan.Product.Featured_Usage_Level = '2000 kWh';
          this.Price_atFeatured_Usage_Level = this.featuredOffer.Price_At_2000_kwh;
          break;
        }
      }
    }
  }

  showConfirmationPop() {
    //console.log(this.featuredOffer);
    this.selectedOffer.emit(this.featuredOffer);
    this.selectCheckBox = false;
    //this.planPopModal.showPlanPopModal();
  }

  onSelect(event) {
    event.preventDefault();
    this.selectCheckBox = true;
  }

   toggleButton() {
    this.enableSelect = !this.enableSelect;
  }
  closeCheckBox() {
    this.selectCheckBox = false;
    this.enableSelect = false;
  }



}
