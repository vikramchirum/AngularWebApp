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
  // latestInvoice: IInvoice;
  private activeServiceAccountSubscription: Subscription = null;
  // private invoiceServiceSubscription: Subscription = null;

  constructor(private ServiceAccountService: ServiceAccountService, private invoiceService: InvoiceService) {
  }

  ngOnInit() {
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.activeServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.noCurrentDue = this.activeServiceAccount.Current_Due > 0 ? true : false;
        console.log('Current due date', this.noCurrentDue);
        this.exceededDueDate = this.activeServiceAccount.Past_Due > 0 ? true : false;
        console.log('Exceeded due date', this.exceededDueDate);
        // this.exceededDueDate =  (new Date(this.activeServiceAccount.Due_Date) > new Date()) ? true : false;
        // this.invoiceServiceSubscription = this.invoiceService.getLatestInvoice(this.activeServiceAccount.Id).subscribe(
        //   latestInvoice => {
        //     this.latestInvoice = latestInvoice;
        //     console.log('Latest invoice', this.latestInvoice);
        //     this.exceededDueDate = this.activeServiceAccount.Past_Due > 0 ? true : false;
        //     console.log('Exceeded due date', this.exceededDueDate);
        //   }
        // );
      }
    );
  }

  ngOnDestroy() {
    // if (this.invoiceServiceSubscription) {
    //   this.invoiceServiceSubscription.unsubscribe();
    // }
    this.activeServiceAccountSubscription.unsubscribe();
  }
}
