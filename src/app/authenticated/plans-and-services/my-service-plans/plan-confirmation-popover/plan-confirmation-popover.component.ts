import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccountService} from '../../../../core/CustomerAccount.service';
import {CustomerAccount} from '../../../../core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-plan-confirmation-popover',
  templateUrl: './plan-confirmation-popover.component.html',
  styleUrls: ['./plan-confirmation-popover.component.scss']
})
export class PlanConfirmationPopoverComponent implements OnInit {
  @ViewChild('planPopModal') public planPopModal: ModalDirective;
  CustomerAccountServiceSubscription: Subscription = null;
  customerDetails: CustomerAccount = null;

  constructor(private CustomerAccountService: CustomerAccountService) { }

  ngOnInit() {
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => this.customerDetails = result
    );
  }

  renewedNewplan() {
    this.hidePlanPopModal();
    location.reload();
  }

  public showPlanPopModal(): void {
    this.planPopModal.show();
  }

  public hidePlanPopModal(): void {
    this.planPopModal.hide();
  }
}
