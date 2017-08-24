import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/core/user.service';
import { environment } from 'environments/environment';
import { HomeMultiAccountsModalComponent } from './home-multi-accounts-modal/home-multi-accounts-modal.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { result, startsWith } from 'lodash';
import {CustomerAccountService} from '../../core/CustomerAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccount} from '../../core/models/customeraccount/customeraccount.model';

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {

  startsWith = startsWith;
  service_account_length: number = null;
  env = environment.Name;
  username: string = null;
  accordionVisible: boolean = null;
  hoverMenu: string = null;
  customerDetails: CustomerAccount = null;
  CustomerAccountServiceSubscription: Subscription = null;
  UserServiceSubscription: Subscription = null;
  @ViewChild('homeMultiAccountsModal') homeMultiAccountsModal: HomeMultiAccountsModalComponent;

  constructor(
    private UserService: UserService,
    private Router: Router,
    private ServiceAccountService: ServiceAccountService,
    private CustomerAccountService: CustomerAccountService
  ) { }

  showHomeMultiAccountsModal() {
    this.homeMultiAccountsModal.show();
  }

  ngAfterViewInit() {
    // this.homeMultiAccountsModal.show();
    if (!this.ServiceAccountService.ActiveServiceAccountId) {
      this.homeMultiAccountsModal.show();
     this.UserServiceSubscription =  this.UserService.UserObservable.subscribe(
        result => { this.service_account_length = result.Account_permissions.length;
                    this.username = result.Profile.Username; }
      );
      if (!this.ServiceAccountService.ActiveServiceAccountId) {
        if (this.service_account_length != null && this.service_account_length === 2) {
          this.homeMultiAccountsModal.hideServiceUpgradeModal();
        } else if (this.service_account_length != null && this.service_account_length > 2) {
          this.homeMultiAccountsModal.show();
        }
      }
    }
  }

  ngOnInit() {
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => { this.service_account_length = result.Account_permissions.length;
                  this.username = result.Profile.Username; }
    );
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.customerDetails = result; }
    );
  }

  logout($event) {
    result($event, 'preventDefault');
    this.UserService.logout();
    this.Router.navigate(['/login']);
  }

  toggleAccordion(evt) {
    this.accordionVisible = !this.accordionVisible;
  }

  onNotify(message: string): void {
    this.accordionVisible = false;
  }

  doMouseenter(menu: string) {
    this.hoverMenu = menu;
  }

  doMouseleave() {
    this.hoverMenu = null;
  }

  ngOnDestroy() {
    result(this.CustomerAccountServiceSubscription, 'unsubscribe');
    result(this.UserServiceSubscription, 'unsubscribe');
  }

}
