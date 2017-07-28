/**
 * Created by vikram.chirumamilla on 6/26/2017.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {IInvoice} from '../../../../../core/models/invoices/invoice.model';
import {ViewBillComponent} from '../../../../../shared/components/view-bill/view-bill.component';

@Component({
  selector: 'mygexa-view-my-bill-modal',
  templateUrl: './view-my-bill-modal.component.html',
  styleUrls: ['./view-my-bill-modal.component.scss']
})
export class ViewMyBillModalComponent implements OnInit {

  @ViewChild('viewMyBillModal') public viewMyBillModal: ModalDirective;
  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;
  public bill: IInvoice;

  constructor() {
  }
  ngOnInit() {
  }
  public show(bill: IInvoice): void {
    this.viewBill.PopulateItemizedBill(bill);
    this.viewMyBillModal.show();
  }

  public hideViewMyBillModal(): void {
    this.viewMyBillModal.  hide();
  }
}
