import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-home-multi-accounts-modal',
  templateUrl: './home-multi-accounts-modal.component.html',
  styleUrls: ['./home-multi-accounts-modal.component.scss']
})
export class HomeMultiAccountsModalComponent implements OnInit {

  @ViewChild('homeMultiAccountsModal') public homeMultiAccountsModal: ModalDirective;
  constructor() { }

  public show(): void {
    this.homeMultiAccountsModal.show();
  }

  public hideServiceUpgradeModal(): void {
    this.homeMultiAccountsModal.hide();
  }

  ngOnInit() {
  }

}


