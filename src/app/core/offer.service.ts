import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpClient} from './httpclient';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import {clone, forEach, pull, map} from 'lodash';

import {AllOffersClass} from './models/offers/alloffers.model';
import {ServiceAccountService} from './serviceaccount.service';

@Injectable()
export class OfferService {

  public ActiveServiceAccountOffersCache: AllOffersClass[] = null;
  public ActiveServiceAccountOfferObservable: Observable<AllOffersClass[]> = null;

  private initialized: boolean = null;
  private ActiveServiceAccountOfferObservers: Observer<AllOffersClass>[] = [];
  private requestObservable: Observable<Response> = null;
  private _ActiveServiceAccountId: string = null;

  constructor(private http: HttpClient, private serviceAccountService: ServiceAccountService) {
    // Make the Observables for others to listen to.
    this.ActiveServiceAccountOfferObservable = Observable.create((observer: Observer<any>) => {
      // 1. Collect, or 'push', new observers to the observable's collection.
      this.ActiveServiceAccountOfferObservers.push(observer);
      // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
      if (this.initialized) {
        observer.next(this.ActiveServiceAccountOffersCache);
      }
      // 3. Provide the new observer a clean-up function to prevent memory leaks.
      return () => pull(this.ActiveServiceAccountOfferObservers, observer);
    });

    // Console.log the latest customer account.
    this.ActiveServiceAccountOfferObservable.subscribe(
    );

    // Respond to the first (initializing) call.
    this.ActiveServiceAccountOfferObservable.first().delay(0).subscribe(() => {
      this.initialized = true;
    });


    // Keep the active Service account id synced.
    this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      ActiveServiceAccountId => this.ActiveServiceAccountId = ActiveServiceAccountId.Id
    );
  }

  get ActiveServiceAccountId(): string {
    return this._ActiveServiceAccountId;
  }

  set ActiveServiceAccountId(ActiveServiceAccountId: string) {
    if (this._ActiveServiceAccountId !== ActiveServiceAccountId) {
      this._ActiveServiceAccountId = ActiveServiceAccountId;
      this.getRenewalOffers();
    }
  }


  /**
   * Returns Service account usage history based on Id
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

    // If we don't have a Active Service Account Id then return null;
    if (this.ActiveServiceAccountId === null) {
      return Observable.from(null);
    }

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.http.get(`/service_accounts/${this.ActiveServiceAccountId}/offers`)
      .map(data => data.json())
      .map(data => map(data, OffersData => new AllOffersClass(OffersData)))
      .catch(error => this.http.handleHttpError(error));

    // Handle the new Service account data.
    this.requestObservable.subscribe(
      data => this.ActiveServiceAccountOffersCache = <any>data,
      error => this.http.handleHttpError(error),
      () => {
        console.log( 'Offers =', this.ActiveServiceAccountOffersCache);
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.ActiveServiceAccountOfferObservers, this.ActiveServiceAccountOffersCache);
      }
    );
    return this.requestObservable;
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }
}
