import { Component, OnDestroy, OnInit} from '@angular/core';
import { ServiceAccountService } from '../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from '../../core/models/serviceaccount/serviceaccount.model';
import { OffersStore } from '../../core/store/offersstore';
import { NotificationOptionsStore } from '../../core/store/notificationoptionsstore';
import { NotificationStatus } from '../../core/models/enums/notificationstatus';
import { INotificationOption } from '../../core/models/notificationoptions/notificationoption.model';
import { InvoiceStore } from '../../core/store/invoicestore';
import { PaymentsHistoryStore } from '../../core/store/paymentsstore';
import { AccountType } from '../../core/models/enums/accounttype';
import { NotificationType } from '../../core/models/enums/notificationtype';
import { RenewalStore } from '../../core/store/renewalstore';

@Component({
  selector: 'mygexa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;
  notificationOptionsStoreSubscription: Subscription = null;
  ActiveServiceAccount: ServiceAccount = null;
  Is_Auto_Bill_Pay: boolean = null;
  Paperless_Billing: boolean = null;
  Budget_Billing: boolean = null;
  ShowAutoBillPay: boolean = null;
  ShowPaperlessBilling: boolean = null;
  ShowBudgetBilling: boolean = null;
  ShowEnergySavingTips: boolean = null;
  NotificationOptions: INotificationOption = null;
  SearchNotificationOptions = null;
  currentView: string = null;


  constructor( private ServiceAccountService: ServiceAccountService,
               private OfferStore: OffersStore,
               private renewalStore: RenewalStore,
               private NotificationOptionsStore: NotificationOptionsStore,
               private InvoiceStore: InvoiceStore,
               private PaymentStore: PaymentsHistoryStore
  ) { }

  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        if (ActiveServiceAccount) {

          this.ActiveServiceAccount = ActiveServiceAccount;
          this.renewalStore.LoadRenewalDetails(this.ActiveServiceAccount.Id);
          this.SearchNotificationOptions = {
            Account_Info: {
              Account_Type: AccountType.GEMS_Residential_Customer_Account,
              Account_Number: ActiveServiceAccount.Customer_Account_Id,
            },
            Type: NotificationType.Bill
          };
          this.NotificationOptionsStore.LoadNotificationOptions(this.SearchNotificationOptions);
          this.InvoiceStore.LoadLatestInvoiceDetails(ActiveServiceAccount.Id);
          this.PaymentStore.LoadPaymentsHistory(ActiveServiceAccount);
          this.Is_Auto_Bill_Pay = this.ActiveServiceAccount.Is_Auto_Bill_Pay;
          this.Budget_Billing = this.ActiveServiceAccount.Budget_Billing;
          this.notificationOptionsStoreSubscription = this.NotificationOptionsStore.Notification_Options.subscribe(
            Options => {
              if (Options && Options.length > 0) {
                this.NotificationOptions = Options[0];
                this.Paperless_Billing = (String(this.NotificationOptions.Status) === NotificationStatus[NotificationStatus.Active]) ? Boolean(this.NotificationOptions.Paperless) : false;
              } else {
                this.Paperless_Billing = false;
              }
              this.showHideTile();
            }
          );
          this.OfferStore.LoadLyricOfferDetails(this.ActiveServiceAccount.TDU_DUNS_Number);
        }
      });
  }

  showHideTile() {
    if ( this.ActiveServiceAccount && (this.Paperless_Billing != null) ) {
      this.ShowAutoBillPay = this.Is_Auto_Bill_Pay ? false : true;
      this.ShowPaperlessBilling = (this.Is_Auto_Bill_Pay && !this.Paperless_Billing) ? true : false;
      this.ShowEnergySavingTips = (this.Is_Auto_Bill_Pay  && this.Paperless_Billing && this.Budget_Billing) ? true : false;

      if (this.ShowAutoBillPay) {
        this.currentView = 'ShowAutoBillPay';
      } else if (this.ShowPaperlessBilling) {
        this.currentView = 'ShowPaperlessBilling';
      } else {
        this.currentView = 'ShowEnergySavingTips';
      }
    }
  }

  ngOnDestroy() {
    this.serviceAccountServiceSubscription.unsubscribe();
    if (this.notificationOptionsStoreSubscription) {
      this.notificationOptionsStoreSubscription.unsubscribe();
    }
  }
}
