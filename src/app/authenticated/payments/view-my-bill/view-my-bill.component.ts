import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IBill } from 'app/core/models/bill.model';
import { IBillLineItem } from 'app/core/models/billlineitem.model';
import { Bill, BillService } from 'app/core/Bill';
import { first, orderBy, filter } from 'lodash';
import {BillingAccountService} from 'app/core/BillingAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {ViewBillComponent} from 'app/authenticated/payments/components/view-bill.component';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnDestroy, AfterViewInit {

  all_bills: IBill[];  sort_all_bills: IBill[];

  error: string = null;
  public req_bill: IBill;
  Bill: Bill = null;
  public billing_account_id: number;
  public id: string;
  date_today = new Date;
  bill: Bill;

  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;

  private ActiveBillingAccountSubscription: Subscription = null;

  constructor(
    private invoice_service: InvoiceService,
    private BillingAccountService: BillingAccountService
  ) { }

  ngAfterViewInit() {
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      result => {
        this.billing_account_id = Number(result.Id);
        this.invoice_service.getBills(this.billing_account_id)
          .subscribe(
            response => {
              this.all_bills = response;
              this.sort_all_bills = orderBy(this.all_bills, ['Invoice_Date'], ['desc']);
              this.req_bill = <any> first(this.sort_all_bills);
              this.viewBill.getItemizedBills(this.req_bill);
            },
            error => {
              this.error = error.Message;
            }
          );
      }
    );
  }

  ngOnDestroy() {
    this.ActiveBillingAccountSubscription.unsubscribe();
  }

}
