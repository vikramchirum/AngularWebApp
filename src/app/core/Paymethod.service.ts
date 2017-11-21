import { Injectable } from '@angular/core';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { clone, cloneDeep, endsWith, find, forEach, get, isError, noop, map, pull, replace, set } from 'lodash';
import { HttpClient } from './httpclient';
import { environment } from 'environments/environment';
import { UserService } from './user.service';
import { CustomerAccountService } from './CustomerAccount.service';
import { CustomerAccount } from './models/CustomerAccount/CustomerAccount.model';
import { Paymethod } from './models/paymethod/Paymethod.model';
import { IPaymethodRequest } from './models/paymethod/paymethodrequest.model';
import { IPaymethodRequestCreditCard } from './models/paymethod/paymethodrequestcreditcard.model';
import { IPaymethodRequestEcheck } from './models/paymethod/paymethodrequestecheck.model';
import { CardBrands } from './models/paymethod/constants';

@Injectable()
export class PaymethodService {

  ForteJsCache: any = null;
  ForteJsObservable: Observable<any> = null;
  PaymethodsCache: Paymethod[] = null;
  PaymethodsObservable: Observable<Paymethod[]> = null;

  private initialized: boolean = null;
  private ForteJsObservers: Observer<any>[] = [];
  private PaymethodsObservers: Observer<any>[] = [];
  private requestObservable: Observable<Response> = null;
  private CustomerAccount: CustomerAccount = null;
  private _CustomerAccountId: string = null;

  constructor(
    private HttpClient: HttpClient,
    private UserService: UserService,
    private CustomerAccountService: CustomerAccountService
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

    // Assign the Http request to prevent any similar requests.
    this.requestObservable = this.HttpClient.get(`/Paymethods?isActive=true&clientApplicationName=Residential%20Portal&userKey=${this.CustomerAccountId}${endsWith(this.CustomerAccountId, '-1') ? '' : '-1'}`)
      .map(data => data.json())
      .map(data => map(data, PaymethodData => new Paymethod(PaymethodData)))
      .catch(error => error);

    // Handle the new payment methods data.
    this.requestObservable.subscribe(
      Paymethods => this.PaymethodsCache = <any>Paymethods,
      error => this.HttpClient.handleHttpError(error),
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

  private emitToObservers(observers: Observer<any>[], data: any) {
    // We "clone" because an observer may remove itself out of the original array - this solves an indexing problem.
    forEach(clone(observers), observer => observer.next(data));
  }

  GetForteOneTimeToken(Paymethod: IPaymethodRequest): Observable<any> {

    const PaymethodPayload = cloneDeep(Paymethod.CreditCard || Paymethod.Echeck);

    set(PaymethodPayload, 'api_login_id', environment.Forte_Api_Key);

    return Observable.create((observer: Observer<any>) => {

      this.ForteJsCache.createToken(PaymethodPayload)
        .error(error => {
          console.log('Forte error:', error);
          observer.error(error);
          observer.complete();
        })
        .success(data => {
          console.log('Forte success:', data);
          observer.next(data);
          observer.complete();
        });
    },
    error => { console.log('Error occurred here', error); });

  }

  // Credit Card methods / processors.
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

  AddPaymethodCreditCardFromComponent(addCreditCardComponent): Observable<any> {
    return this.AddPaymethodCreditCard.apply(
      this,
      this.AddPaymethodCreditCardFromComponentObject(addCreditCardComponent)
    );
  }

  AddPaymethodCreditCardFromComponentObject(addCreditCardComponent): any {
    return [
      addCreditCardComponent.formGroup.value.cc_name.toUpperCase(),
      <IPaymethodRequestCreditCard> {
        card_number: addCreditCardComponent.formGroup.value.cc_number,
        expire_year: addCreditCardComponent.formGroup.value.cc_year,
        expire_month: addCreditCardComponent.formGroup.value.cc_month,
        cvv: addCreditCardComponent.formGroup.value.cc_ccv
      }
    ];
  }

  // eCheck methods / processors.
  AddPaymethodEcheck(account_holder: string, Paymethod: IPaymethodRequestEcheck): Observable<any> {
    const FortePaymethodPayload: IPaymethodRequest = {
      account_holder: account_holder,
      Echeck: {
        account_number: Paymethod.account_number,
        account_type: Paymethod.account_type,
        routing_number: Paymethod.routing_number
      }
    };
    return this.AddPaymethod(FortePaymethodPayload);
  }

  AddPaymethodEcheckFromComponent(addEcheckComponent): Observable<any> {
    return this.AddPaymethodEcheck.apply(
      this,
      this.AddPaymethodEcheckFromComponentObject(addEcheckComponent)
    );
  }

  AddPaymethodEcheckFromComponentObject(addEcheckComponent): any {
    return [
      addEcheckComponent.formGroup.value.echeck_name.toUpperCase(),
      <IPaymethodRequestEcheck> {
        account_number: addEcheckComponent.formGroup.value.echeck_accounting,
        account_type: 'c',
        routing_number: addEcheckComponent.formGroup.value.echeck_routing,
        other_info: addEcheckComponent.formGroup.value.echeck_info
      }
    ];
  }

  // Paymethod methods.
  AddPaymethod(Paymethod: IPaymethodRequest): Observable<any> {

    const PaymethodType = Paymethod.CreditCard ? 'CreditCard' : 'eCheck';

    return Observable.create((observer: Observer<any>) => {

      this.GetForteOneTimeToken(Paymethod).subscribe(
        ForteResult => {

          if (isError(ForteResult)) { return observer.error(ForteResult); }

          const body = {
            UserName: this.UserService.UserCache.Profile.Username,
            Token: ForteResult.onetime_token,
            Paymethod_Customer: {
              Id: `${this.CustomerAccountId}${endsWith(this.CustomerAccountId, '-1') ? '' : '-1'}`,
              FirstName: this.CustomerAccount.First_Name,
              LastName: this.CustomerAccount.Last_Name
            },
            // PaymethodName: get(CardBrands, ForteResult.card_type, 'Unknown') + '{' + ForteResult.last_4 + '}',
            PaymethodType: PaymethodType,
            AccountHolder: Paymethod.account_holder.toUpperCase(),
            AccountNumber: ForteResult.last_4,

          };

          if (Paymethod.CreditCard) {
            set(body, 'CreditCardType', replace(get(CardBrands, ForteResult.card_type, 'Unknown'), ' ', ''));
            set(body, 'PaymethodName', get(CardBrands, ForteResult.card_type, 'Unknown') + '{ ' + ForteResult.last_4 + ' }');
          } else {
            set(body, 'RoutingNumber', Paymethod.Echeck.routing_number);
            set(body, 'PaymethodName', 'eCheck { ' + Paymethod.Echeck.routing_number + ' }');
          }


          this.HttpClient.post('/Paymethods', JSON.stringify(body))
            .map(res => res.json())
            .catch(error => this.HttpClient.handleHttpError(error))
            .subscribe(res => {
              console.log('POST /Paymethods', res);
              observer.next(res);
              observer.complete();
            });

        },
        error => {
          return observer.error(error);
        }

      );
    },
    error => {
      console.log('error occurred', error);
    }
    );

  }

  RemovePaymethod(Paymethod: Paymethod): Observable<any> {
      const body = {
        PaymethodId: Paymethod.PayMethodId,
        UserName: this.UserService.UserCache.Profile.Username
    };
    return Observable.create((observer: Observer<any>) => {
      // Call out to the API to set the isActive to "false".
      this.HttpClient.put(`/Paymethods`, body)
        .map(res => res.json())
        .catch(error => this.HttpClient.handleHttpError(error))
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

}
