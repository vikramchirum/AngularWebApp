import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {BillingAccountClass} from 'app/core/models/BillingAccount.model';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'mygexa-home-multi-accounts-modal',
  templateUrl: './home-multi-accounts-modal.component.html',
  styleUrls: ['./home-multi-accounts-modal.component.scss']
})
export class HomeMultiAccountsModalComponent implements OnInit {

  private BillingAccounts: BillingAccountClass[] = null;
  private BillingAccountsSubscription: Subscription = null;
  public active_billing_account_id: any = null;

  @ViewChild('homeMultiAccountsModal') public homeMultiAccountsModal: ModalDirective;
  constructor(private billingAccountService: BillingAccountService, private router: Router) {
    this.BillingAccountsSubscription = this.billingAccountService.BillingAccountsObservable.subscribe(
      BillingAccounts => this.BillingAccounts = BillingAccounts
    );
  }

  ngOnDestory() {
    this.BillingAccountsSubscription.unsubscribe();
  }

  public show(): void {
    this.homeMultiAccountsModal.show();
  }

  public hideServiceUpgradeModal(): void {
    this.homeMultiAccountsModal.hide();
  }
  setActBillAcct(id: any) {
    this.active_billing_account_id = id;
  }

  onContinue() {
     this.billingAccountService.SetActiveBillingAccount(this.active_billing_account_id);
     this.hideServiceUpgradeModal();
  }

  ngOnInit() {
  }

}


