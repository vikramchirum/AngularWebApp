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
  // @Input() bill_Id: string;

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
    if (this.bill_object) { this.getItemizedBills(this.bill_object); }
  }

  public getItemizedBills(bill_object: IBill) {
    const invoice_id = Number(bill_object.Invoice_Id);
    this.invoice_service.getItemizedBillDetails(invoice_id)
      .subscribe(
        bill_item_details => {
          this.openCharges = [];
          this.bill_object = bill_object;
          this.invoice_num = invoice_id;
          this.invoice_date = bill_object.Invoice_Date;
          this.bill_item_details = bill_item_details;
          this.bill_item_details_TDU_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TDSP'));
          this.bill_item_details_gexa_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA' && item.Bill_Line_Item_Sub_Type === 'Energy'));
          this.bill_item_details_other_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA' && item.Bill_Line_Item_Sub_Type === 'None'));
          this.bill_item_details_tax = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TAX'));
        }
      );
  }

}
