import {Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-phone-number-confirmation-modal',
  templateUrl: './phone-number-confirmation-modal.component.html',
  styleUrls: ['./phone-number-confirmation-modal.component.scss']
})
export class PhoneNumberConfirmationModalComponent implements OnInit {
  @ViewChild('phonePopModal') public phonePopModal: ModalDirective;

  constructor() { }

  ngOnInit() {
  }
  public showPhoneConfirmationModal(): void {
    this.phonePopModal.show();
  }

  public hidePhoneConfirmationModal(): void {
    this.phonePopModal.hide();
  }
  saveChanges() {

  }

}
