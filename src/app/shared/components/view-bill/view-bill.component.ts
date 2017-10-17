import { Component, OnInit, Input } from '@angular/core';
import { filter, forEach, clone } from 'lodash';

import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';

import { IInvoiceLineItem } from 'app/core/models/invoices/invoicelineitem.model';
import { IInvoice } from 'app/core/models/invoices/invoice.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { UtilityService } from 'app/core/utility.service';

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

  invoicesUrl: string;

  serviceAccountId: string;

  private openCharges = [];

  private ActiveServiceAccountSubscription: Subscription = null;
  private tduName: string;

  constructor(private invoiceService: InvoiceService,
              private serviceAccountService: ServiceAccountService,
              private utilityService: UtilityService,
  ) {
  }

  ngOnInit() {

    if (this.bill_object) {
      this.PopulateItemizedBill(this.bill_object);
    }

     this.ActiveServiceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.tduName = result.TDU_Name;
        this.serviceAccountId = result.Id;
      }
    );
  }

  public PopulateItemizedBill(bill_object: IInvoice) {
    const invoice_id = +(bill_object.Invoice_Id);
    this.invoicesUrl = environment.Documents_Url.concat(`/invoice/generate/${invoice_id}`);
      this.invoiceService.getItemizedInvoiceDetails(invoice_id, this.serviceAccountId)
      .subscribe(
        bill_item_details => {
          if (!bill_item_details) {
            return;
          }
          console.log('bill item details', bill_item_details);
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

  public downloadInvoice($event) {

    $event.preventDefault();
    $event.stopPropagation();

    const invoiceId = this.bill_object.Invoice_Id;
    this.invoiceService.getInvoicePDF(invoiceId).subscribe(
      data => this.utilityService.downloadFile(data)
    );
  }
}
