import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-payment-confirmation-modal',
  templateUrl: './payment-confirmation-modal.component.html',
  styleUrls: ['./payment-confirmation-modal.component.scss']
})
export class PaymentConfirmationModalComponent implements OnInit {
  @ViewChild('paymentConfirmationModal') public paymentConfirmationModal: ModalDirective;
  errorResponse: string; minPayRequired: boolean = null;
  @Output() public onPaymentConfirmationEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  public hideConfirmationMessageModal(): void {
    this.paymentConfirmationModal.hide();
  }

  public onConfirmation(selection: boolean) {
    this.onPaymentConfirmationEvent.emit(selection);
  }

  public showConfirmationMessageModal(errorResponse: string, minPayReq: boolean): void {
    if (!errorResponse) {
      return;
    }
    this.errorResponse = errorResponse;
    this.minPayRequired = minPayReq ? true : false;
    this.paymentConfirmationModal.show();
  }
}
