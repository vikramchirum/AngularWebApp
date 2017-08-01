import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { find, includes, random } from 'lodash';
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
  unenrollingFromAutoBillPay: boolean = null;
  enrollingToAutoBillPay: boolean = null;

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
    this.determineTheAutoBillPaymethod();
    this.ChangeDetectorRef.detectChanges();
  }

  private PaymethodsSubscription: Subscription = null;
  private _Paymethods: Paymethod[] = null;
  get Paymethods() { return this._Paymethods; }
  set Paymethods(Paymethods) {
    this._Paymethods = Paymethods;
    this.determineTheAutoBillPaymethod();
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

  determineTheAutoBillPaymethod() {
    if (this.ActiveServiceAccount && this.Paymethods) {
      this.autoBillPaymethod = find(this.Paymethods, ['PayMethodId', this.ActiveServiceAccount.PayMethodId], null);
    }
  }

  enrollInAutoBillPaySelected(selectedPaymethod: Paymethod): void {
    this.enrollingToAutoBillPay = true;
    this.AutoPaymentConfigService.EnrollAutoPayment({
      PayMethodId: selectedPaymethod.PayMethodId,
      ServiceAccountModel: {
        ServiceAccountId: this.ActiveServiceAccount.Id,
        BillingSystem: 'GEMS',
        AccountTypeName: 'ContractServicePoint',
        BusinessUnit: 'GEXA'
      }
    }).subscribe(
      res => {
        this.ActiveServiceAccount.AutoPayConfigId = Number(res.Id);
        this.ActiveServiceAccount.PayMethodId = selectedPaymethod.PayMethodId;
        this.ActiveServiceAccount.Is_Auto_Bill_Pay = true;
        this.autoBillPaymethod = selectedPaymethod;
        setTimeout(() => this.enrollingToAutoBillPay = false, random(500, 1500));
      },
      err => console.log('err', err)
    );
  }

  unenrollInAutoBillPaySelected(): void {
    this.unenrollingFromAutoBillPay = true;
    this.AutoPaymentConfigService.CancelAutoPayment(this.ActiveServiceAccount.AutoPayConfigId)
      .subscribe(
        () => {
          this.ActiveServiceAccount.AutoPayConfigId = null;
          this.ActiveServiceAccount.PayMethodId = null;
          this.ActiveServiceAccount.Is_Auto_Bill_Pay = false;
          this.autoBillPaymethod = null;
          setTimeout(() => this.unenrollingFromAutoBillPay = false, random(500, 1500));
        }
      );
  }

  switchingAutoBillPaySelected(selectedPaymethod: Paymethod) {
    this.enrollingToAutoBillPay = true;
    this.AutoPaymentConfigService.UpdateAutoPayment({
      APCId: this.ActiveServiceAccount.AutoPayConfigId,
      PayMethodId: selectedPaymethod.PayMethodId
    }).subscribe(
      () => {
        this.ActiveServiceAccount.PayMethodId = selectedPaymethod.PayMethodId;
        this.autoBillPaymethod = selectedPaymethod;
        setTimeout(() => {
          this.enrollingToAutoBillPay = false;
          this.switchingAutoBillPay = false;
        }, random(500, 1500));
      }
    );
  }

  switchingAutoBillPayCanceled(): void {
    this.switchingAutoBillPay = false;
  }

}
