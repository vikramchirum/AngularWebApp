/**
 * Created by vikram.chirumamilla on 6/26/2017.
 */
import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { ViewBillComponent } from 'app/shared/components/view-bill/view-bill.component';

@Component({
  selector: 'mygexa-view-my-bill-modal',
  templateUrl: './view-my-bill-modal.component.html',
  styleUrls: ['./view-my-bill-modal.component.scss']
})
export class ViewMyBillModalComponent {

  @ViewChild('viewMyBillModal') public viewMyBillModal: ModalDirective;
  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;
  public bill: IInvoice;

  constructor() {}

  public show(bill: IInvoice): void {
    this.viewBill.PopulateItemizedBill(bill);
    this.viewMyBillModal.show();
  }

  public hideViewMyBillModal(): void {
    this.viewMyBillModal.hide();
  }
}
