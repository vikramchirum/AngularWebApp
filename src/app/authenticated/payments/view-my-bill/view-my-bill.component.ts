import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IBill } from 'app/core/models/bill.model';
import { IBillLineItem } from 'app/core/models/billlineitem.model';
import { Bill, BillService } from 'app/core/Bill';
import { filter } from 'lodash';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit {

  all_bills: IBill[];
  error: string = null;
  public req_bill: IBill[];
  Bill: Bill = null;
  public billing_account_id: number;

  date_today = new Date;
  bill: Bill;

  constructor(
    private invoice_service: InvoiceService,
    private BillService: BillService
  ) {
    this.billing_account_id = 1408663;
    // this.BillService.getCurrentBill()
    //   .then((bill: Bill) => this.bill = bill);
  }

  ngOnInit() {

    this.invoice_service.getBills(this.billing_account_id)
      .subscribe(
        response => {
          this.all_bills = response;
          const currentDate = new Date(), y = currentDate.getFullYear() - 1, m = currentDate.getMonth(); // remove -1 to get current year data
          const firstDay = new Date(y, m, 1);
          const lastDay = new Date(y, m + 1, 0);
          this.req_bill = filter(this.all_bills, bill => ( bill.Invoice_Date >= firstDay  && bill.Invoice_Date <= lastDay ));
        },
        error => {
          this.error = error.Message;
        }

      );
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => this.Bill = Bill);
  }

}
