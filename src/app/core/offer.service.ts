import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from './httpclient';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BillingAccountService} from 'app/core/BillingAccount.service';

import { Observer } from 'rxjs/Observer';
import {observable} from 'rxjs/symbol/observable';
import { clone, forEach, get, pull, map } from 'lodash';
import { environment } from 'environments/environment';
import {AllOffersClass} from './models/offers/alloffers.model';

@Injectable()
export class OfferService {

  public ActiveBillingAccountOffersCache: AllOffersClass[] = null;
  public ActiveBillingAccountOfferObservable: Observable<AllOffersClass[]> = null;

  private initialized: boolean = null;
  private ActiveBillingAccountOfferObservers: Observer<AllOffersClass>[] = [];
  private requestObservable: Observable<Response> = null;
  private _ActiveBillingAccountId: string = null;

  constructor(private http: HttpClient,
              private BillingAccountService: BillingAccountService) {
    // Make the Observables for others to listen to.
    this.ActiveBillingAccountOfferObservable = Observable.create((observer: Observer<any>) => {
      // 1. Collect, or 'push', new observers to the observable's collection.
      this.ActiveBillingAccountOfferObservers.push(observer);
      // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
      if (this.initialized) {
        observer.next(this.ActiveBillingAccountOffersCache);
      }
      // 3. Provide the new observer a clean-up function to prevent memory leaks.
      return () => pull(this.ActiveBillingAccountOfferObservers, observer);
    });

    // Console.log the latest customer account.
    this.ActiveBillingAccountOfferObservable.subscribe(
    );

    // Respond to the first (initializing) call.
    this.ActiveBillingAccountOfferObservable.first().delay(0).subscribe(() => {
      this.initialized = true;
    });


    // Keep the active billing account id synced.
    this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      ActiveBillingAccountId => this.ActiveBillingAccountId = ActiveBillingAccountId.Id
    );
  }

  get ActiveBillingAccountId(): string {
    return this._ActiveBillingAccountId;
  }

  set ActiveBillingAccountId(ActiveBillingAccountId: string) {
    if (this._ActiveBillingAccountId !== ActiveBillingAccountId) {
      this._ActiveBillingAccountId = ActiveBillingAccountId;
      this.getRenewalOffers();
    }
  }


  /**
   * Returns billing account usage history based on Id
   * @param offer
   * @returns {Observable<any[]>}
   */

  getOffers(offer): Observable<any[]> {
    console.log ( 'Offer params', offer);
    return this.http
      .get(`/v2/Offers?option.startDate=${offer.startDate}&option.plan.tDU.duns_Number=${offer.dunsNumber}`)
      .map((response: Response) => this.processApiData(response))
      .catch(error => this.http.handleHttpError(error));
  }

  private processApiData(res: Response) {
    return res.json();
  }

  getRenewalOffers(): Observable<Response> {

    // If we're already requesting then return the original request observable.
    if (this.requestObservable) {
      return this.requestObservable;
    }

    // If we don't have a Active Billing Account Id then return null;
    if (this.ActiveBillingAccountId === null) {
      return Observable.from(null);
    }

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.http.get(`/billing_accounts/${this.ActiveBillingAccountId}/offers`)
      .map(data => data.json())
      .map(data => map(data, OffersData => new AllOffersClass(OffersData)))
      .catch(error => this.http.handleHttpError(error));

    // Handle the new Billing account data.
    this.requestObservable.subscribe(
      data => this.ActiveBillingAccountOffersCache = <any>data,
      error => this.http.handleHttpError(error),
      () => {
        console.log( 'Offers =', this.ActiveBillingAccountOffersCache);
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.ActiveBillingAccountOfferObservers, this.ActiveBillingAccountOffersCache);
      }
    );
    return this.requestObservable;
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }
}
