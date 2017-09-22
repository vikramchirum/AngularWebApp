/**
 * Created by vikram.chirumamilla on 7/31/2017.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

import { InvoiceService } from 'app/core/invoiceservice.service';
import { IInvoice } from 'app/core/models/invoices/invoice.model';

@Component({
  selector: 'mygexa-my-bill',
  templateUrl: './my-bill.component.html',
  styleUrls: ['./my-bill.component.scss']
})
export class MyBillComponent implements OnInit, OnDestroy {

  dollarAmountFormatter: string;
  noCurrentDue: boolean = null;
  exceededDueDate: boolean = null;
  activeServiceAccount: ServiceAccount;
  latestInvoice: IInvoice;
  private activeServiceAccountSubscription: Subscription = null;

  constructor(private ServiceAccountService: ServiceAccountService, private invoiceService: InvoiceService) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.activeServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.noCurrentDue = this.activeServiceAccount.Current_Due > 0 ? false : true;
        // this.exceededDueDate =  (new Date(this.activeServiceAccount.Due_Date) > new Date()) ? true : false;
        this.invoiceService.getLatestInvoice(this.activeServiceAccount.Id).subscribe(
          latestInvoiceId => {
            this.invoiceService.getInvoice(latestInvoiceId, this.activeServiceAccount.Id)
              .filter(() => !this.activeServiceAccountSubscription.closed)
              .subscribe(latestInvoice => this.latestInvoice = latestInvoice);
          }
        );
        this.exceededDueDate = this.latestInvoice.Due_Date ? true : false;
      }
    );
  }

  ngOnDestroy() {
    // this.activeServiceAccountSubscription.unsubscribe();
  }
}
