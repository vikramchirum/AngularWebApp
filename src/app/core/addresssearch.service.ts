/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClient } from './httpclient';

import {ISearchAddressRequest} from './models/serviceaddress/searchaddressrequest';
import {IServiceAddress} from './models/serviceaddress/serviceaddress';

@Injectable()
export class AddressSearchService {

  constructor(private http: HttpClient) {
  }

  searchAddress(searchRequest: ISearchAddressRequest): Observable<IServiceAddress[]> {

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/address_search/`;
    return this.http.get(relativePath, params)
      .map((response: Response) => { return <IServiceAddress[]> response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }
}
