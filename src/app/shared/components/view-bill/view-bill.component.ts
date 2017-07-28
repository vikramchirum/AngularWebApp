import { Component, OnInit, Input } from '@angular/core';
import { filter, forEach, clone } from 'lodash';

import { InvoiceService } from 'app/core/invoiceservice.service';
import { IInvoiceLineItem } from 'app/core/models/invoices/invoicelineitem.model';
import { IInvoice } from 'app/core/models/invoices/invoice.model';

@Component({
  selector: 'mygexa-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  @Input() bill_object: IInvoice;

  error: string = null;
  public  bill_item_details: IInvoiceLineItem[] = [];
  public  bill_item_details_gexa_charges: IInvoiceLineItem[] = [];
  public  bill_item_details_other_charges: IInvoiceLineItem[] = [];
  public  bill_item_details_TDU_charges: IInvoiceLineItem[] = [];
  public  bill_item_details_tax: IInvoiceLineItem[] = [];

  public invoice_num: number;
  public invoice_date: Date;

  private openCharges = [];

  constructor(private invoice_service: InvoiceService) {
  }

  ngOnInit() {
    if (this.bill_object) {
      this.PopulateItemizedBill(this.bill_object);
    }
  }

  public PopulateItemizedBill(bill_object: IInvoice) {
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
          this.bill_item_details_gexa_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA'
                                                       && item.Bill_Line_Item_Sub_Type === 'Energy'));
          this.bill_item_details_other_charges = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA'
                                                        && item.Bill_Line_Item_Sub_Type === 'None'));
          this.bill_item_details_tax = filter(this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TAX'));
        }
      );
  }

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  public subtotal(charge: any) {
    let total = 0;
    forEach(charge, item => total += item['Amount']);
    return total;
  }

  /**
   * Return whether a charge is considered to be open.
   * @param charge
   * @returns {boolean}
   */
  public chargeOpened(charge) {
    return this.openCharges.indexOf(charge) >= 0;
  }

  /**
   * Push/pull a charge from the array of open charges.
   * @param charge
   */
  public chargeToggle(charge) {
    const indexOf = this.openCharges.indexOf(charge);
    if (indexOf < 0) {
      this.openCharges.push(charge);
    } else {
      this.openCharges.splice(indexOf, 1);
    }
  }
}
