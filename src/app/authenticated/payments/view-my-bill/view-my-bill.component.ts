import { Component, OnInit } from '@angular/core';
import { Bill, BillService } from '../../../shared/bill';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit {

  private date_today: Date;
  private bills: Bill[];
  private requestingBillData: boolean;

  /**
   * Provide the view the notice that we're done requesting.
   */
  private getBillInformationDone () {
    this.requestingBillData = false;
  }

  /**
   * Get the user's bill information from the API.
   */
  private getBillInformation() {
    this.bills = [];
    this.BillService.getBills()
      .then((bills: Bill[]) => {
        this.bills = bills;
        this.getBillInformationDone();
      })
      .catch((err: any) => {
        console.log(err);
        this.getBillInformationDone();
      });
  }

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  private subtotal(charge: any) {
    let subtotal = 0;
    for (const item in charge.items) {
      if (typeof charge.items[item].amount === 'number') {
        subtotal += charge.items[item].amount;
      }
    }
    return subtotal;
  }

  /**
   * Calculate the total of a bill's charges.
   * @param bill
   * @returns {number}
   */
  private total(bill: Bill) {
    let total = 0;
    for (const charge in bill.charges) {
      if (bill.charges[charge]) { total += this.subtotal(bill.charges[charge]); }
    }
    return total;
  }

  constructor(
    private BillService: BillService
  ) {
    this.date_today = new Date;
    this.requestingBillData = true;
    this.getBillInformation();
  }

  ngOnInit() { }

}
