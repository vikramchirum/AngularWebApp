import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { IBillLineItem } from 'app/core/models/billlineitem.model';
import { IBill } from 'app/core/models/bill.model';

import { Bill, BillService } from 'app/core/Bill';
import { filter, forEach } from 'lodash';

@Component({
  selector: 'mygexa-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  @Input() bill_Id: string;
  @Input() bill_object: IBill;

  error: string = null;
  public  bill_item_details: IBillLineItem[] = [];
  public  bill_item_details_gexa_charges: IBillLineItem[] = [];
  public  bill_item_details_other_charges: IBillLineItem[] = [];
  public  bill_item_details_TDU_charges: IBillLineItem[] = [];
  public  bill_item_details_tax: IBillLineItem[] = [];


  public invoice_num: number;
  public invoice_date: Date;
  bill: Bill = null;
  private openCharges = [];

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  private subtotal(charge: any) {
    let total = 0;
    forEach(charge, item => total += item['Amount']);
    return total;
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
    private BillService: BillService,
    private invoice_service: InvoiceService
  ) { }

  ngOnInit() {
    this.invoice_num = Number(this.bill_object.Invoice_Id);
    this.invoice_date = new Date(this.bill_object.Invoice_Date)
    this.invoice_service.getItemizedBillDetails(this.invoice_num)
      .subscribe(
        response => {
          this.bill_item_details = response;
          this.bill_item_details_TDU_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TDSP'));
          this.bill_item_details_gexa_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA' && item.Bill_Line_Item_Sub_Type === 'Energy'));
          this.bill_item_details_other_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA' && item.Bill_Line_Item_Sub_Type === 'None'));
          this.bill_item_details_tax = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TAX'));
        }
      );

    //If we've been provided an Id, use it.
    // if (this.bill_Id) {
    //   // Get the specified bill.
    //   this.BillService.getBill(this.bill_Id)
    //     .then((bill: Bill) => this.bill = bill)
    //     .catch((err: any) => console.log(err));
    // } else {
    //   // Otherwise, get the current bill.
    //   this.BillService.getCurrentBill()
    //     .then((bill: Bill) => this.bill = bill)
    //     .catch((err: any) => console.log(err));
    // }
  }

}
