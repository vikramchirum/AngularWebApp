import {Component, OnDestroy, OnInit} from '@angular/core';
import { ServiceAccountService } from '../../../core/serviceaccount.service';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccount } from '../../../core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-refer-friend-program',
  templateUrl: './refer-friend-program.component.html',
  styleUrls: ['./refer-friend-program.component.scss']
})
export class ReferFriendProgramComponent implements OnInit, OnDestroy {
  serviceAccountServiceSubscription: Subscription = null;
  ActiveServiceAccount: ServiceAccount = null;
  IsDisconnectedServiceAddress: boolean = null;

  constructor(private ServiceAccountService: ServiceAccountService) { }

  ngOnInit() {
    this.serviceAccountServiceSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccount => {
        this.ActiveServiceAccount = ActiveServiceAccount;
        if (this.ActiveServiceAccount) {
          this.IsDisconnectedServiceAddress   = this.ActiveServiceAccount.Status === 'Disconnected' ? true : false;
        }});
  }
  ngOnDestroy() {
    if (this.serviceAccountServiceSubscription) { this.serviceAccountServiceSubscription.unsubscribe(); }
  }

}
