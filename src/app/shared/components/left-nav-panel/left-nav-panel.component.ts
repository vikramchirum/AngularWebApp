import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import { ServiceAccountService } from '../../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mygexa-left-nav-panel',
  templateUrl: './left-nav-panel.component.html',
  styleUrls: ['./left-nav-panel.component.scss']
})
export class LeftNavPanelComponent implements OnInit, OnDestroy {

@Input() sideNavData;
  ServiceAccountSubscription: Subscription;
  IsDisconnectedServiceAddress: boolean = null;
  constructor( private ServiceAccountService: ServiceAccountService
  ) { }

  ngOnInit() {
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ASA => {
        if (ASA) { this.IsDisconnectedServiceAddress = (ASA.Status === 'Disconnected') ? true : false; }
      }
    );
  }

  ngOnDestroy() {
    if (this.ServiceAccountSubscription) { this.ServiceAccountSubscription.unsubscribe(); }
  }

}
