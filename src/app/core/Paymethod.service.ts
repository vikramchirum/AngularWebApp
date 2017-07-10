
import { Injectable} from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';

import { clone, find, forEach, get, noop, map, pull, replace, set } from 'lodash';
import { CardBrands, PaymethodClass, IPaymethodRequest, IPaymethodRequestEcheck, IPaymethodRequestCreditCard } from './models/Paymethod.model';
import { HttpClient } from './httpclient';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { CustomerAccountClass } from './models/CustomerAccount.model';
import { BillingAccountService } from './BillingAccount.service';

@Injectable()
export class PaymethodService {

  ForteJsCache: any = null;
  ForteJsObservable: Observable<any> = null;
  PaymethodsCache: PaymethodClass[] = null;
  PaymethodsObservable: Observable<PaymethodClass[]> = null;

  private initialized: boolean = null;
  private ForteJsObservers: Observer<any>[] = [];
  private PaymethodsObservers: Observer<any>[] = [];
  private requestObservable: Observable<Response> = null;
  private CustomerAccount: CustomerAccountClass = null;
  private _CustomerAccountId: string = null;

  constructor(
    private HttpClient: HttpClient,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService,
    private BillingAccountService: BillingAccountService
  ) {

    // Make Observables for others to listen to.
    // 1. Collect, or 'push', new observers to the observable's collection.
    // 2. Send the latest cached data to the new observer (only if we've initialized with some data.)
    // 3. Provide the new observer a clean-up function to prevent memory leaks.
    this.PaymethodsObservable = Observable.create((observer: Observer<any>) => {
      this.PaymethodsObservers.push(observer);
      if (this.initialized) { observer.next(this.PaymethodsCache); }
      return () => pull(this.PaymethodsObservers, observer);
    });

    // Provide other components an observable that returns ForteJs (once loaded.)
    this.ForteJsObservable = Observable.create((observer: Observer<any>) => {
      // If we have ForteJs loaded, then return it.
      if (this.ForteJsCache) {
        observer.next(this.ForteJsCache);
        observer.complete();
        return () => noop();
      }
      // If we do not have ForteJs loaded, save the observer for later emission.
      this.ForteJsObservers.push(observer);
      // Provide a clean-up function.
      return () => pull(this.ForteJsObservers, observer);
    });
    // Because Forte.js is loaded asynchronously, continue looking for it.
    const forteLookup = setInterval(() => {
      this.ForteJsCache = get(window, 'forte', null);
      // Once we've gotten it, stop looking and serve it.
      if (this.ForteJsCache) {
        clearInterval(forteLookup);
        this.emitToObservers(this.ForteJsObservers, this.ForteJsCache);
        this.ForteJsObservable = Observable.of(this.ForteJsCache);
      }
    }, 500);

    // Respond to the first (initializing) call.
    this.PaymethodsObservable.first().delay(0).subscribe(
      () => this.initialized = true
    );

    // Keep our customer account id up-to-date.
    this.UserService.UserCustomerAccountObservable.subscribe(
      CustomerAccountId => this.CustomerAccountId = CustomerAccountId
    );

    // Keep our customer account object up-to-date.
    this.CustomerAccountService.CustomerAccountObservable.subscribe(
      CustomerAccount => this.CustomerAccount = CustomerAccount
    );

  }

  get CustomerAccountId(): string {
    return this._CustomerAccountId;
  }
  set CustomerAccountId(CustomerAccountId: string) {
    if (this._CustomerAccountId !== CustomerAccountId) {
      this._CustomerAccountId = CustomerAccountId;
      this.UpdatePaymethods();
    }
  }

  UpdatePaymethods(): Observable<Response> {

    // If we're already requesting then return the original request observable.
    if (this.requestObservable) { return this.requestObservable; }

    // If we don't have a Customer Account Id then return null;
    if (this.CustomerAccountId === null) { return Observable.from(null); }

    const options = new RequestOptions({
      headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.HttpClient.get(`/Paymethods?userKey=${ this.CustomerAccountId }&isActive=true`, options)
      .map(data => data.json())
      .map(data => map(data, PaymethodData => new PaymethodClass(PaymethodData)))
      .catch(error => error);

    // Handle the new payment methods data.
    this.requestObservable.subscribe(
      Paymethods => this.PaymethodsCache = <any>Paymethods,
      error => this.handleError(error),
      () => {
        console.log('Paymethods =', this.PaymethodsCache);
        // We're no longer requesting.
        this.requestObservable = null;
        // Emit our new data to all of our observers.
        this.emitToObservers(this.PaymethodsObservers, this.PaymethodsCache);
      }
    );

    return this.requestObservable;

  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = get(body, 'error', JSON.stringify(body));
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  AddPaymethodCreditCard(account_holder: string, Paymethod: IPaymethodRequestCreditCard): Observable<any> {
    const FortePaymethodPayload: IPaymethodRequest = {
      account_holder: account_holder,
      CreditCard: {
        card_number: Paymethod.card_number.replace(/\D/g, ''),
        expire_year: Paymethod.expire_year,
        expire_month: Paymethod.expire_month,
        cvv: Paymethod.cvv
      }
    };
    return this.AddPaymethod(FortePaymethodPayload);
  }

  AddPaymethodEcheck(account_holder: string, Paymethod: IPaymethodRequestEcheck): Observable<any> {
    const FortePaymethodPayload: IPaymethodRequest = {
      account_holder: account_holder,
      Echeck: {
        account_number: Paymethod.account_number,
        account_type: 'c',
        routing_number: Paymethod.routing_number
      }
    };
    return this.AddPaymethod(FortePaymethodPayload);
  }

  AddPaymethod(Paymethod: IPaymethodRequest): Observable<any> {

    const PaymethodType = Paymethod.CreditCard ? 'CreditCard' : 'eCheck';
    const PaymethodPayload = Paymethod.CreditCard || Paymethod.Echeck;

    set(PaymethodPayload, 'api_login_id', environment.Forte_Api_Key);

    return Observable.create((observer: Observer<any>) => {

      this.ForteJsCache.createToken(PaymethodPayload)
        .error(data => {
          observer.next(data);
          observer.complete();
        })
        .success(data => {

          const body = {
            Token: data.onetime_token,
            Paymethod_Customer: {
              Id: this.CustomerAccountId,
              FirstName: this.CustomerAccount.First_Name,
              LastName: this.CustomerAccount.Last_Name
            },
            PaymethodName: 'My Paymethod Name',
            PaymethodType: PaymethodType,
            AccountHolder: Paymethod.account_holder.toUpperCase(),
            AccountNumber: data.last_4
          };

          if (Paymethod.CreditCard) {
            set(body, 'CreditCardType', replace(get(CardBrands, data.card_type, 'Unknown'), ' ', ''));
          } else {
            set(body, 'RoutingNumber', Paymethod.Echeck.routing_number);
          }

          this.HttpClient.post('/Paymethods', JSON.stringify(body))
            .map(res => res.json())
            .catch(error => this.handleError(error))
            .subscribe(res => {
              console.log(res);
              observer.next(res);
              observer.complete();
              // this.UpdatePaymethods();
            });

        });

    });

  }

  RemovePaymethod(Paymethod: PaymethodClass): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      // Call out to the API to set the isActive to "false".
      this.HttpClient.put(`/Paymethods?id=${Paymethod.PayMethodId}`, '')
        .map(res => res.json())
        .catch(error => this.handleError(error))
        .subscribe(res => {
          // Return back the result information, if our original caller wants it or not, and close.
          observer.next(res);
          observer.complete();
          // Look in our cache for the Paymethod to remove.
          const paymethodToPull = find(this.PaymethodsCache, ['PayMethodId', Paymethod.PayMethodId]);
          // If the removed Paymethod was found then remove it and emit to observers.
          if (paymethodToPull) {
            pull(this.PaymethodsCache, paymethodToPull);
            this.emitToObservers(this.PaymethodsObservers, this.PaymethodsCache);
          }
        });
    });
  }

  Is_Used_For_Autopay(Paymethod: PaymethodClass): boolean {
    return !!find(this.BillingAccountService.BillingAccountsCache, { Is_Auto_Bill_Pay: Paymethod.PayMethodId });
  }

}
