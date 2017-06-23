import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IBill } from 'app/core/models/bill.model';
import { IBillLineItem } from 'app/core/models/billlineitem.model';

import { Bill, BillService } from 'app/core/Bill';

import { filter } from 'lodash';

@Component({
  selector: 'mygexa-current-charges',
  templateUrl: './current-charges.component.html',
  styleUrls: ['./current-charges.component.scss']
})
export class CurrentChargesComponent implements OnInit {
  all_bills: IBill[];
  error: string = null;
  public req_bill: IBill[];
  Bill: Bill = null;
  public billing_account_id: number;
  constructor(
    private BillService: BillService,
    private invoice_service: InvoiceService
  ) {
    this.billing_account_id = 1408663;
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
          debugger;
          sessionStorage.setItem('invoice_id', this.req_bill[0].Invoice_Id.toString());
          sessionStorage.setItem('invoice_date', this.req_bill[0].Invoice_Date.toString());

        },
        error => {
          this.error = error.Message;
        }

      );
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => this.Bill = Bill);
  }
}
