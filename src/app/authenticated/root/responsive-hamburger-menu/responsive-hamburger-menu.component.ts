import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { result, startsWith } from 'lodash';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'mygexa-responsive-hamburger-menu',
  templateUrl: './responsive-hamburger-menu.component.html',
  styleUrls: ['./responsive-hamburger-menu.component.scss']
})
export class ResponsiveHamburgerMenuComponent implements OnInit, OnDestroy {

  @Output() signout = new EventEmitter<string>();
  @Output() notify = new EventEmitter<string>();
  startsWith = startsWith;

  ServiceAccountSubscription: Subscription = null;
  isRTP: boolean = null;

  constructor(
        public Router: Router,
        public ServiceAccountService: ServiceAccountService
  ) { }

  ngOnInit() { 
    this.ServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => this.isRTP = activeServiceAccount.Current_Offer.Is_RTP
    );
  }

  ngOnDestroy() {
    this.ServiceAccountSubscription.unsubscribe();
  }

  routerOnClick() {
    this.notify.emit('Router changed');
  }

  doSignOut($event) {
    if ($event && $event.preventDefault) { $event.preventDefault(); }
    this.routerOnClick();
    this.signout.emit();
  }

}
