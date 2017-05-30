import { Component, OnInit } from '@angular/core';
import { Bill, BillService } from '../../../shared/Bill';

@Component({
  selector: 'mygexa-view-my-bill',
  templateUrl: './view-my-bill.component.html',
  styleUrls: ['./view-my-bill.component.scss']
})
export class ViewMyBillComponent implements OnInit {

  private date_today: Date;
  private balance_forward: number;
  private bills: Bill[];
  private requestingBillData: boolean;
  private openCharges;

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
        // Get the first bill.
        this.bills = [bills[0]];
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
  private total(bill: Bill): number {
    let total = 0;
    for (const charge in bill.charges) {
      if (bill.charges[charge]) { total += this.subtotal(bill.charges[charge]); }
    }
    return total;
  }

  private chargeOpened(charge) {
    return this.openCharges.indexOf(charge) >= 0;
  }

  private chargeToggle(charge) {
    const indexOf = this.openCharges.indexOf(charge);
    if (indexOf < 0) {
      this.openCharges.push(charge);
    } else {
      this.openCharges.splice(indexOf, 1);
    }
  }

  current_charges(): number {
    return (this.bills.length > 0 ? this.total(this.bills[0]) : 0) + this.balance_forward;
  }

  constructor(
    private BillService: BillService
  ) {
    this.balance_forward = 2000;
    this.date_today = new Date;
    this.requestingBillData = true;
    this.openCharges = [];
    this.getBillInformation();
  }

  ngOnInit() { }

}
