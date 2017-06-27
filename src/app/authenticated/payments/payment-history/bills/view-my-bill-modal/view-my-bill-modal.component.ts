/**
 * Created by vikram.chirumamilla on 6/26/2017.
 */
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-view-my-bill-modal',
  templateUrl: './view-my-bill-modal.component.html',
  styleUrls: ['./view-my-bill-modal.component.scss']
})
export class ViewMyBillModalComponent implements OnInit {

  @ViewChild('viewMyBillModal') public viewMyBillModal: ModalDirective;
  // @Input() title?:string;

  constructor() {
  }

  ngOnInit() {
  }
  public show(): void {
    this.viewMyBillModal.show();
  }

  public hideViewMyBillModal(): void {
    this.viewMyBillModal.hide();
  }
}
