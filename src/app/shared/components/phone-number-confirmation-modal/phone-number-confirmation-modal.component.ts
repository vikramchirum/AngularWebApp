import {Component, OnInit, ViewChild,  Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-phone-number-confirmation-modal',
  templateUrl: './phone-number-confirmation-modal.component.html',
  styleUrls: ['./phone-number-confirmation-modal.component.scss']
})
export class PhoneNumberConfirmationModalComponent implements OnInit {
  @ViewChild('phonePopModal') public phonePopModal: ModalDirective;
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  savechanges: boolean = null;
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
    this.savechanges = true;
    this.action.emit(this.savechanges);
  }

}
