import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ServiceAccountService} from 'app/core/serviceaccount.service';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {
  IsInRenewalTimeFrame: boolean;
  serviceAccountSubscription: Subscription;
  constructor(private serviceAccount_service: ServiceAccountService) {
    this.IsInRenewalTimeFrame = false;
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.serviceAccountSubscription = this.serviceAccount_service.ActiveServiceAccountObservable.subscribe(
      result => {
        this.IsInRenewalTimeFrame = result.IsUpForRenewal;
      });
  }

  ngOnDestroy() {
    this.serviceAccountSubscription.unsubscribe();
  }
}
