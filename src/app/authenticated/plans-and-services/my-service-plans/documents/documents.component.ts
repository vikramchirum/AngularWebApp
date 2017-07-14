import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BillingAccountService} from 'app/core/BillingAccount.service';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {
  IsInRenewalTimeFrame: boolean;
  billingAccountSubscription: Subscription;
  constructor(private billingAccount_service: BillingAccountService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.billingAccountSubscription = this.billingAccount_service.ActiveBillingAccountObservable.subscribe(
      result => {
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.billingAccountSubscription.unsubscribe();
  }
}
