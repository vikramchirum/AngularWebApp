import { Component, OnDestroy, OnInit } from '@angular/core';

import { BillingAccountService } from 'app/core/BillingAccount.service';
import { PaymentsHistoryService } from 'app/core/payments-history.service';
import { PaymentsHistory } from 'app/core/models/payments-history.model';
import { Subscription } from 'rxjs/Subscription';
import { BillingAccountClass } from 'app/core/models/BillingAccount.model';

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  Payments: PaymentsHistory[] = [];
  PaymentsSortingBy: string;
  PaymentsPage: number;
  PaymentsPerPage = 10;

  private ActiveBillingAccountSubscription: Subscription = null;
  private _activeBillingAccount: BillingAccountClass = null;
  private get activeBillingAccount(): BillingAccountClass { return this._activeBillingAccount; }
  private set activeBillingAccount(activeBillingAccount) {
    if (this._activeBillingAccount !== activeBillingAccount) {
      this._activeBillingAccount = activeBillingAccount;
      this.PaymentsHistoryService.GetPaymentsHistory(activeBillingAccount).subscribe(
        PaymentsHistoryItems => this.Payments = PaymentsHistoryItems
      );
    }
  }

  private PaymentsSortingByLesser: number = null;
  private PaymentsSortingByGreater: number = null;
  get PaymentsSortingByDesc(): boolean { return this.PaymentsSortingByGreater === -1; }
  set PaymentsSortingByDesc(desc: boolean) {
    if (desc) {
      this.PaymentsSortingByLesser = 1;
      this.PaymentsSortingByGreater = -1;
    } else {
      this.PaymentsSortingByLesser = -1;
      this.PaymentsSortingByGreater = 1;
    }
  }

  private sorting(a: PaymentsHistory, b: PaymentsHistory): number {
    if (a[this.PaymentsSortingBy] < b[this.PaymentsSortingBy]) {
      return this.PaymentsSortingByLesser;
    }
    if (a[this.PaymentsSortingBy] > b[this.PaymentsSortingBy]) {
      return this.PaymentsSortingByGreater;
    }
    return 0;
  }

  get currentPageOfPayments(): PaymentsHistory[] {
    const sorted = this.Payments.sort((a, b) => this.sorting(a, b));
    const index = this.PaymentsPage * this.PaymentsPerPage;
    const extent = index + this.PaymentsPerPage;
    if (extent > sorted.length) {
      return sorted.slice(index);
    }
    return sorted.slice(index, extent);
  }

  get currentPageNumber(): number {
    return this.PaymentsPage + 1;
  }
  get totalPages(): number {
    return Math.ceil(this.Payments.length / this.PaymentsPerPage);
  }

  nextPage(): void {
    this.PaymentsPage++;
  }

  gotoPage(index: number): void {
    this.PaymentsPage = index;
  }

  previousPage(): void {
    this.PaymentsPage--;
  }

  sortBy(attribute: string): void {
    if (this.PaymentsSortingBy === attribute) {
      this.PaymentsSortingByDesc = !this.PaymentsSortingByDesc;
    } else {
      this.PaymentsSortingBy = attribute;
      this.PaymentsSortingByDesc = true;
    }
  }

  constructor(
    private BillingAccountService: BillingAccountService,
    private PaymentsHistoryService: PaymentsHistoryService
  ) {
    this.PaymentsPage = 0;
    this.PaymentsSortingBy = 'date';
    this.PaymentsSortingByDesc = true;
  }

  ngOnInit() {
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => this.activeBillingAccount = activeBillingAccount
    );
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
  }

}
