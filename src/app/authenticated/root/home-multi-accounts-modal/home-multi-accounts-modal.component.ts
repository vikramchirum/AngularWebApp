import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ngx-bootstrap';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import {UserService} from '../../../core/user.service';

@Component({
  selector: 'mygexa-home-multi-accounts-modal',
  templateUrl: './home-multi-accounts-modal.component.html',
  styleUrls: ['./home-multi-accounts-modal.component.scss']
})
export class HomeMultiAccountsModalComponent implements OnInit {

  private ServiceAccounts: ServiceAccount[] = null;
  private ServiceAccountsSubscription: Subscription = null;
  public active_service_account_id: any = null;

  @ViewChild('homeMultiAccountsModal') public homeMultiAccountsModal: ModalDirective;
  constructor(private serviceAccountService: ServiceAccountService, private router: Router, private userService: UserService) {
    this.ServiceAccountsSubscription = this.serviceAccountService.ServiceAccountsObservable.subscribe(
      ServiceAccounts => this.ServiceAccounts = ServiceAccounts
    );
  }

  ngOnDestory() {
    this.ServiceAccountsSubscription.unsubscribe();
  }

  public show(): void {
    this.homeMultiAccountsModal.show();
  }

  public hideServiceUpgradeModal(): void {
    this.homeMultiAccountsModal.hide();
  }
  setActBillAcct(id: any) {
    this.active_service_account_id = id;
  }

  onContinue() {
     this.serviceAccountService.SetActiveServiceAccount(this.active_service_account_id);
     this.hideServiceUpgradeModal();
  }

  ngOnInit() {
  }

}


