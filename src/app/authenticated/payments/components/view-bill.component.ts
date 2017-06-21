import { Component, OnInit, Input } from '@angular/core';

import { Bill, BillService } from 'app/core/Bill';

@Component({
  selector: 'mygexa-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  @Input() bill_Id: string;

  bill: Bill = null;
  private openCharges = [];

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  private subtotal(charge: any) {
    return Bill.subtotal(charge);
  }

  /**
   * Return whether a charge is considered to be open.
   * @param charge
   * @returns {boolean}
   */
  private chargeOpened(charge) {
    return this.openCharges.indexOf(charge) >= 0;
  }

  /**
   * Push/pull a charge from the array of open charges.
   * @param charge
   */
  private chargeToggle(charge) {
    const indexOf = this.openCharges.indexOf(charge);
    if (indexOf < 0) {
      this.openCharges.push(charge);
    } else {
      this.openCharges.splice(indexOf, 1);
    }
  }

  constructor(
    private BillService: BillService
  ) { }

  ngOnInit() {
    // If we've been provided an Id, use it.
    if (this.bill_Id) {
      // Get the specified bill.
      this.BillService.getBill(this.bill_Id)
        .then((bill: Bill) => this.bill = bill)
        .catch((err: any) => console.log(err));
    } else {
      // Otherwise, get the current bill.
      this.BillService.getCurrentBill()
        .then((bill: Bill) => this.bill = bill)
        .catch((err: any) => console.log(err));
    }
  }

}
