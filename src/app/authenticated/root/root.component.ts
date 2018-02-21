import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/core/user.service';
import { environment } from 'environments/environment';
import { HomeMultiAccountsModalComponent } from './home-multi-accounts-modal/home-multi-accounts-modal.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { result, startsWith } from 'lodash';
import {CustomerAccountService} from '../../core/CustomerAccount.service';
import {Subscription} from 'rxjs/Subscription';
import {CustomerAccount} from '../../core/models/customeraccount/customeraccount.model';
import { NotificationOptionsStore } from '../../core/store/notificationoptionsstore';
import { AccountType } from '../../core/models/enums/accounttype';
import { NotificationType } from '../../core/models/enums/notificationtype';
import { InvoiceStore } from '../../core/store/invoicestore';
import { AnnouncementsService } from '../../core/announcementservice.service';
import { IAnnouncement } from "../../core/models/announcements/announcement.model";
import { ISearchAnnouncements } from "../../core/models/announcements/searchannouncementsrequest.model";

@Component({
  selector: 'mygexa-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NotificationOptionsStore]

})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {
  openNotification: boolean = null;
  public startsWith = startsWith;
  service_account_length: number = null;
  env = environment.Name;
  username: string = null;
  accordionVisible: boolean = null;
  hoverMenu: string = null;
  customerDetails: CustomerAccount = null;
  announcements: IAnnouncement[] = null;
  AnnouncememtsServiceSubscription: Subscription = null;
  CustomerAccountServiceSubscription: Subscription = null;
  ServiceAccountSubscription: Subscription = null;
  UserServiceSubscription: Subscription = null;
  SearchNotificationOptions = null;
  IsDisconnectedServiceAddress: boolean = null;
  @ViewChild('homeMultiAccountsModal') homeMultiAccountsModal: HomeMultiAccountsModalComponent;
  @ViewChild('menuIcon') menuIcon;
  @ViewChild('menuDropdown') menuDropdown;
  constructor(
    private UserService: UserService,
    public Router: Router,
    public ServiceAccountService: ServiceAccountService,
    private CustomerAccountService: CustomerAccountService,
    private NotificationOptionsStore: NotificationOptionsStore,
    private InvoiceStore: InvoiceStore,
    private AnnouncememtsService: AnnouncementsService
  ) {}

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
    this.openNotification = (document.readyState === 'complete') ? true : false;
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        if (ActiveServiceAccount) {
          this.IsDisconnectedServiceAddress = ActiveServiceAccount.Status === 'Disconnected' ? true : false;
          const search_options = {} as ISearchAnnouncements;
          search_options.Active = true;
          this.AnnouncememtsService.searchAnnouncements( search_options ).subscribe(
            result => {
              this.announcements = result;
            });
        }
      }
    );
    this.UserServiceSubscription = this.UserService.UserObservable.subscribe(
      result => { this.service_account_length = result.Account_permissions.length;
                  this.username = result.Profile.Username; }
    );
    this.CustomerAccountServiceSubscription = this.CustomerAccountService.CustomerAccountObservable.subscribe(
      result => { this.customerDetails = result;
        this.SearchNotificationOptions = {
          Account_Info: {
            Account_Type: AccountType.GEMS_Residential_Customer_Account,
            Account_Number: result.Id,
          },
          Type: NotificationType.Bill
        };
        this.NotificationOptionsStore.LoadNotificationOptions(this.SearchNotificationOptions);
      }
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

  @HostListener('document:click', ['$event']) clickedOutside($event) {
    // here you can hide your menu

    if (!((this.menuIcon && this.menuIcon.nativeElement && this.menuIcon.nativeElement.contains($event.target)) ||
    (this.menuDropdown && this.menuDropdown.nativeElement && this.menuDropdown.nativeElement.contains($event.target)))) {
      if (this.accordionVisible) {
        this.accordionVisible = false;
      }
    }
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

  close_announcement(announcement: IAnnouncement){
    var index = this.announcements.indexOf(announcement);
    this.announcements.splice(index, 1);
  }

  ngOnDestroy() {
    result(this.CustomerAccountServiceSubscription, 'unsubscribe');
    result(this.UserServiceSubscription, 'unsubscribe');
    result(this.ServiceAccountSubscription, 'unsubscribe');
  }

}
