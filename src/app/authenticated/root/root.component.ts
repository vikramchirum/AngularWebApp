import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/core/user.service';
import { environment } from 'environments/environment';
import { HomeMultiAccountsModalComponent } from './home-multi-accounts-modal/home-multi-accounts-modal.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit, AfterViewInit {

  service_account_length: number = null;
  env = environment.Name;
  user: string;
  accordionVisible: boolean = false;


  @ViewChild('homeMultiAccountsModal') homeMultiAccountsModal: HomeMultiAccountsModalComponent;

  constructor(private user_service: UserService, private router: Router, private viewContainerRef: ViewContainerRef, private serviceAcctService: ServiceAccountService) {
    this.service_account_length = null;
  }

  showHomeMultiAccountsModal() {
    this.homeMultiAccountsModal.show();
  }
  ngAfterViewInit() {
    // this.homeMultiAccountsModal.show();
    if (!this.serviceAcctService.ActiveServiceAccountId) {
      this.homeMultiAccountsModal.show();
      this.user_service.UserObservable.subscribe(
        result => {
          this.service_account_length = result.Account_permissions.length;
        }
      );
      if (!this.serviceAcctService.ActiveServiceAccountId) {
        if (this.service_account_length != null && this.service_account_length === 2) {
          this.homeMultiAccountsModal.hideServiceUpgradeModal();
        } else if (this.service_account_length != null && this.service_account_length > 2) {
          this.homeMultiAccountsModal.show();
        }
      }
    }
  }

  ngOnInit() {
    this.user_service.UserObservable.subscribe(
      result => { this.service_account_length = result.Account_permissions.length; }
    );
    //this.user = this.user_service.logged_in_user;
    //this.user = this.user_service.user_token;
  }

  logout($event) {
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.user_service.logout();
    this.router.navigate(['/login']);
  }

  toggleAccordion(evt) {
    this.accordionVisible = !this.accordionVisible;
  }

  onNotify(message: string): void {
    this.accordionVisible = false;
  }

}
