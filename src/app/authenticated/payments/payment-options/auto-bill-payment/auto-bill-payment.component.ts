import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { find, includes } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Paymethod } from 'app/core/models/paymethod/Paymethod.model';
import { PaymethodService } from 'app/core/Paymethod.service';
import { AutoPaymentConfigService } from 'app/core/auto-payment-config.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-auto-bill-payment',
  templateUrl: './auto-bill-payment.component.html',
  styleUrls: ['./auto-bill-payment.component.scss']
})
export class AutoBillPaymentComponent implements OnInit, OnDestroy {

  protected includes = includes;

  switchingAutoBillPay: boolean = null;

  private _autoBillPaymethod: Paymethod = null;
  get autoBillPaymethod(): Paymethod { return this._autoBillPaymethod; }
  set autoBillPaymethod(autoBillPaymethod) {
    this._autoBillPaymethod = autoBillPaymethod;
    this.ChangeDetectorRef.detectChanges();
  }

  private ActiveServiceAccountsSubscription: Subscription = null;
  private _ActiveServiceAccount: ServiceAccount = null;
  get ActiveServiceAccount() { return this._ActiveServiceAccount; }
  set ActiveServiceAccount(ActiveServiceAccount) {
    this._ActiveServiceAccount = ActiveServiceAccount;
    this.autoBillPaymethod = find(this.Paymethods, ['PayMethodId', ActiveServiceAccount.PayMethodId], null);
    this.ChangeDetectorRef.detectChanges();
  }

  private PaymethodsSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;
  get Paymethods() { return this._Paymethods; }
  set Paymethods(Paymethods) {
    this._Paymethods = Paymethods;
    this.ChangeDetectorRef.detectChanges();
  }

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private AutoPaymentConfigService: AutoPaymentConfigService,
    private PaymethodService: PaymethodService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ActiveServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => this.ActiveServiceAccount = ActiveServiceAccount
    );
    this.PaymethodsSubscription = this.PaymethodService.PaymethodsObservable.subscribe(
      Paymethods => this.Paymethods = Paymethods
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountsSubscription.unsubscribe();
    this.PaymethodsSubscription.unsubscribe();
  }

  enrollInAutoBillPaySelected(selectedPaymethod: Paymethod): void {
    // this.AutoPaymentConfigService.EnrollInAutoBillPay(
    //   this.ActiveServiceAccount,
    //   selectedPaymethod,
    //   () => this.autoBillPaymethod = selectedPaymethod
    // );
  }

  unenrollInAutoBillPaySelected(): void {
    // this.AutoPaymentConfigService.CancelAutoBillPay(
    //   this.ActiveServiceAccount,
    //   () => this.autoBillPaymethod = null
    // );
  }

  switchingAutoBillPaySelected(selectedPaymethod: Paymethod) {
    // if (selectedPaymethod !== this.autoBillPaymethod) {
    //   this.AutoPaymentConfigService.UpdateAutoBillPay(
    //     this.ActiveServiceAccount,
    //     selectedPaymethod,
    //     () => this.autoBillPaymethod = selectedPaymethod
    //   );
    // }
    // this.switchingAutoBillPay = false;
  }

}
