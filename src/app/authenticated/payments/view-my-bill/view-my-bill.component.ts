import { Component, OnInit } from '@angular/core';

import { Bill, BillService } from 'app/core/Bill';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit {

  private date_today = new Date;
  private bill: Bill;

  constructor(
    private BillService: BillService
  ) {
    this.BillService.getCurrentBill()
      .then((bill: Bill) => this.bill = bill);
  }

  ngOnInit() { }

}
