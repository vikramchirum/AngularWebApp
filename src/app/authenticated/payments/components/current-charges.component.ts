import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IBill } from 'app/core/models/bill.model';
import { Bill, BillService } from 'app/core/Bill';

import { filter } from 'lodash';

@Component({
  selector: 'mygexa-current-charges',
  templateUrl: './current-charges.component.html',
  styleUrls: ['./current-charges.component.scss']
})
export class CurrentChargesComponent implements OnInit {
  all_bills: IBill[]; error: string = null;
  Bill: Bill = null;
  public billing_acoount_id: number;
  constructor(
    private BillService: BillService,
    private invoice_service: InvoiceService
  ) {
    this.billing_acoount_id = 830688;
  }

  ngOnInit() {

    this.invoice_service.getBills(this.billing_acoount_id)
      .subscribe(
        response => {
          this.all_bills = response;

          var currentDate = new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
          var firstDay = new Date(y, m, 1);
          var lastDay = new Date(y, m + 1, 0);
          const metBills = filter(this.all_bills, bill => {
            var req_invoice_date = new Date(bill.invoice_date);
            return ( firstDay <= req_invoice_date && req_invoice_date >= lastDay );
          });

          for ( var i = 0; i < this.all_bills.length; i++) {
            var bill = this.all_bills[i];
            var invoice_date =  bill.invoiceDate;

          }

          console.log('Bills:', this.all_bills);
        },
        error => {
          this.error = error.Message;
        }

      );

    this.BillService.getCurrentBill()
      .then((Bill: Bill) => this.Bill = Bill);
  }
}
