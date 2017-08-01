import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/core/user.service';
import { environment } from 'environments/environment';
import { HomeMultiAccountsModalComponent } from './home-multi-accounts-modal/home-multi-accounts-modal.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { startsWith } from 'lodash';

declare const $: any;

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit, AfterViewInit {

  startsWith = startsWith;
  service_account_length: number = null;
  env = environment.Name;
  user: string;
  accordionVisible: boolean = null;


  @ViewChild('homeMultiAccountsModal') homeMultiAccountsModal: HomeMultiAccountsModalComponent;

  constructor(
    private UserService: UserService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private serviceAcctService: ServiceAccountService
  ) {
    this.service_account_length = null;
  }

  showHomeMultiAccountsModal() {
    this.homeMultiAccountsModal.show();
  }

  ngAfterViewInit() {
    // this.homeMultiAccountsModal.show();
    if (!this.serviceAcctService.ActiveServiceAccountId) {
      this.homeMultiAccountsModal.show();
      this.UserService.UserObservable.subscribe(
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
    $('.custom-nav li.dropdown-full > a:link').mouseenter(function() {
      $(this).closest('.custom-nav').find('li').removeClass('open');
      $(this).parent().addClass('open');
    });
    $('.custom-nav li.dropdown-full .dropdown-menu').mouseleave(function() {
      $(this).closest('li').removeClass('open');
    });
  }

  routerClick() {
    $('.custom-nav li.dropdown-full .dropdown-menu').closest('li').removeClass('open');
  }

  ngOnInit() {
    this.UserService.UserObservable.subscribe(
      result => { this.service_account_length = result.Account_permissions.length; }
    );
  }

  logout($event) {
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.UserService.logout();
    this.router.navigate(['/login']);
  }

  toggleAccordion(evt) {
    this.accordionVisible = !this.accordionVisible;
  }

  onNotify(message: string): void {
    this.accordionVisible = false;
  }

}
