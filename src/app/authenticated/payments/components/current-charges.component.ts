import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';

import { filter } from 'lodash';
import {IInvoice} from '../../../core/models/invoices/invoice.model';

@Component({
  selector: 'mygexa-current-charges',
  templateUrl: './current-charges.component.html',
  styleUrls: ['./current-charges.component.scss']
})
export class CurrentChargesComponent implements OnInit {
  all_bills: IInvoice[];
  error: string = null;
  public req_bill: IInvoice[];
    public service_account_id: number;
  constructor(private invoice_service: InvoiceService
  ) {
    this.service_account_id = 1408663;
  }

  ngOnInit() {

    this.invoice_service.getBills(this.service_account_id)
      .subscribe(
        response => {
          this.all_bills = response;
          const currentDate = new Date(), y = currentDate.getFullYear() - 1, m = currentDate.getMonth(); // remove -1 to get current year data
          const firstDay = new Date(y, m, 1);
          const lastDay = new Date(y, m + 1, 0);
          this.req_bill = filter(this.all_bills, bill => ( bill.Invoice_Date >= firstDay  && bill.Invoice_Date <= lastDay ));
          sessionStorage.setItem('invoice_id', this.req_bill[0].Invoice_Id.toString());
          sessionStorage.setItem('invoice_date', this.req_bill[0].Invoice_Date.toString());

        },
        error => {
          this.error = error.Message;
        }

      );
  }
}
