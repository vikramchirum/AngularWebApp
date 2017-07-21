import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';

import {UserService} from '../../core/user.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HomeMultiAccountsModalComponent} from './home-multi-accounts-modal/home-multi-accounts-modal.component';
import {BillingAccountService} from 'app/core/BillingAccount.service';

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit, AfterViewInit {

  env = environment.Name;
  user: string;
  accordionVisible: boolean = false;
  

  @ViewChild('homeMultiAccountsModal') homeMultiAccountsModal: HomeMultiAccountsModalComponent;

  constructor(private user_service: UserService, private router: Router, private viewContainerRef: ViewContainerRef, private billingAcctService: BillingAccountService) { }

  showHomeMultiAccountsModal() {
    this.homeMultiAccountsModal.show();
  }
  ngAfterViewInit() {
    // this.homeMultiAccountsModal.show();
    if (!this.billingAcctService.ActiveBillingAccountId) {
      this.homeMultiAccountsModal.show();
    }
  }
  ngOnInit() {
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
