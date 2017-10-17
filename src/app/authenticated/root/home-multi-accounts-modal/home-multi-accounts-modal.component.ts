import {Component, Input, ViewChild} from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-home-multi-accounts-modal',
  templateUrl: './home-multi-accounts-modal.component.html',
  styleUrls: ['./home-multi-accounts-modal.component.scss']
})
export class HomeMultiAccountsModalComponent {

  @Input() ServiceAccounts: ServiceAccount[] = null;

  @ViewChild('homeMultiAccountsModal') public homeMultiAccountsModal: ModalDirective;

  public active_service_account_id: any = null;

  constructor(
    private ServiceAccountService: ServiceAccountService
  ) { }

  public show(): void {
    this.homeMultiAccountsModal.show();
  }

  public hideServiceUpgradeModal(): void {
    this.homeMultiAccountsModal.hide();
  }

  setActBillAcct(id: any): void {
    this.active_service_account_id = id;
    this.ServiceAccountService.SetActiveServiceAccount(this.active_service_account_id);
    this.hideServiceUpgradeModal();
  }

}


