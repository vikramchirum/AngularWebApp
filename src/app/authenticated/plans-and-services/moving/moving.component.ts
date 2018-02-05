import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ServiceAccountService } from '../../../core/serviceaccount.service';

@Component({
  selector: 'mygexa-moving',
  templateUrl: './moving.component.html',
  styleUrls: ['./moving.component.scss']
})
export class MovingComponent implements OnInit, OnDestroy {
  ServiceAccountSubscription: Subscription;
  IsDisconnectedServiceAddress: boolean = null;
  constructor( private router: Router,
               private ServiceAccountService: ServiceAccountService) { }

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
