import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { environment } from 'environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { clone, find, forEach, result, reverse } from 'lodash';
import { ColumnHeader } from 'app/core/models/columnheader.model';
import { IInvoiceSearchRequest } from 'app/core/models/invoices/invoicesearchrequest.model';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { PaymentsHistoryService } from 'app/core/payments-history.service';
import { PaymentsHistory } from 'app/core/models/payments/payments-history.model';
import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { ViewMyBillModalComponent } from '../view-my-bill-modal/view-my-bill-modal.component';
import { PaymentsHistoryStore } from '../../../../core/store/paymentsstore';

interface IHistoryLedger {
  Id: string;
  date: Date;
  type: string;
  amount: number;
  balance: number;
}

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild('viewMyBillModal') viewMyBillModal: ViewMyBillModalComponent;

  private dollarAmountFormatter = environment.DollarAmountFormatter;
  public config: any;
  public columnHeaders: ColumnHeader[] = [
    { title: 'Date', name: 'date', type: 'date' },
    { title: 'Ref', name: 'ref', type: '' },
    { title: 'Charges', name: 'charge', type: 'dollar' },
    { title: 'Payments', name: 'payment', type: 'dollar' },
    { title: 'Balance', name: 'balance', type: 'dollar' }
  ];
  public rows: any[] = [];

  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems = 0;
  public transactions: IHistoryLedger[] = null;

  private _Payments: PaymentsHistory[] = null;
  private get Payments(): PaymentsHistory[] { return this._Payments; }
  private set Payments(Payments) {
    this._Payments = Payments;
    this.processData();
  }

  private _Invoices: IInvoice[] = null;
  private get Invoices(): IInvoice[] { return this._Invoices; }
  private set Invoices(Invoices) {
    this._Invoices = Invoices;
    this.processData();
  }

  private ActiveServiceAccountSubscription: Subscription = null;

  constructor(
    private ServiceAccountService: ServiceAccountService,
    private PaymentsHistoryService: PaymentsHistoryService,
    private PaymentsHistoryStore: PaymentsHistoryStore,
    private InvoiceService: InvoiceService
  ) { }

  ngOnInit() {
    this.config = {
      paging: true
    };
  }

  ngAfterViewInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {

        this.Payments = null;
        // this.PaymentsHistoryService.GetPaymentsHistoryCacheable(ActiveServiceAccount).subscribe
        this.PaymentsHistoryStore.PaymentHistory.subscribe(
          PaymentsHistoryItems => {
            if (PaymentsHistoryItems) {
              this.Payments = clone(PaymentsHistoryItems);
              let total = 0;
              forEach(PaymentsHistoryItems, payment => total += payment.PaymentAmount);
            }
          }
        );

        this.Invoices = null;
        const invoiceSearchRequest = {} as IInvoiceSearchRequest;
        invoiceSearchRequest.Service_Account_Id = ActiveServiceAccount.Id;
        this.InvoiceService.getInvoicesCacheable(invoiceSearchRequest).subscribe(
          Invoices => {
            this.Invoices = clone(Invoices);
            let total = 0;
            forEach(Invoices, invoice => total += invoice.Current_Charges);
            console.log('Invoices Total:', total);
            console.log('Invoices', Invoices.length, Invoices);
          }
        );

        this.processData();
      }
    );
  }

  processData() {

    // Only process once we have both payment and invoice data.
    if (!this.Payments || !this.Invoices) { return; }

    // Reverse the order of both payments and invoices from oldest to newest.
    const paymentsOrdered: PaymentsHistory[] = reverse(clone(this.Payments));
    const invoicesOrdered: IInvoice[] = reverse(clone(this.Invoices));

    // Prepare the final transaction collection.
    const transactions: IHistoryLedger[] = [];

    const addInvoice = (Invoice: IInvoice) => {
      // Use any conditions here.
      transactions.push({
        Id: Invoice.Invoice_Id.toString(),
        date: Invoice.Invoice_Date,
        type: 'invoice',
        amount: Invoice.Current_Charges,
        balance: 0
      });
    };
    const addPayment = (Payment: PaymentsHistory) => {
      // Use any conditions here.
      transactions.push({
        Id: '',
        date: Payment.PaymentDate,
        type: 'payment',
        amount: Payment.PaymentAmount,
        balance: 0
      });
    };

    // Process the payments and invoices until neither of them are left remaining.
    while (invoicesOrdered.length || paymentsOrdered.length) {
      if (invoicesOrdered.length === 0) { // If there are no more invoices to process, add the payments.
        addPayment(paymentsOrdered.shift());
      } else if (paymentsOrdered.length === 0) { // If there are no more invoices to process, add the payments.
        addInvoice(invoicesOrdered.shift());
      } else { // There are invoices and payments to compare.
        if (paymentsOrdered[0].PaymentDate < invoicesOrdered[0].Invoice_Date) { // If the next payment is before the next invoice.
          addPayment(paymentsOrdered.shift());
        } else { // Otherwise the next invoice is before the next payment.
          addInvoice(invoicesOrdered.shift());
        }
      }
    }

    // Before we assign the new transactions, calculate the balance, bottom-up.
    let balance = 0;
    forEach(transactions, transaction => {
      if (transaction.type === 'invoice') {
        balance -= transaction.amount;
      } else {
        balance += transaction.amount;
      }
      transaction.balance = balance;
    });
    this.transactions = reverse(transactions);

    this.onChangeTable(this.config);
  }

  onChangeTable(config: any, pageNumber?: number): any {

    this.rows = this.transactions;

    this.totalItems = this.transactions.length;

  }

  ngOnDestroy() {
    result(this.ActiveServiceAccountSubscription, 'unsubscribe');
  }

  openBill(invoice: IHistoryLedger) {
    this.viewMyBillModal.show(find(this.Invoices, { Invoice_Id: Number(invoice.Id) }));
  }

}
