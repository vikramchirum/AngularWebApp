import { Component, OnInit, ViewChild } from '@angular/core';

import { Bill, BillService } from 'app/core/Bill';
import {ViewMyBillModalComponent} from "../payment-history/bills/view-my-bill-modal/view-my-bill-modal.component";

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit {

  private date_today = new Date;
  private bill: Bill;

  @ViewChild('viewMyBillModal') viewMyBillModal: ViewMyBillModalComponent;

  constructor(
    private BillService: BillService
  ) {
    this.BillService.getCurrentBill()
      .then((bill: Bill) => this.bill = bill);
  }

  public showViewMyBillModal() {
    this.viewMyBillModal.show();
  }

  ngOnInit() { }

}
