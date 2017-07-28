/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import { Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import {map} from 'lodash';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { HttpClient } from './httpclient';

import {ISearchAddressRequest} from './models/serviceaddress/searchaddressrequest.model';
import {ServiceAddress} from './models/serviceaddress/serviceaddress.model';

@Injectable()
export class AddressSearchService {

  constructor(private http: HttpClient) {
  }

  searchAddress(searchRequest: ISearchAddressRequest): Observable<ServiceAddress[]> {

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/address_search/`;
    return this.http.get(relativePath, params)
      .map((response: Response) => response.json())
      .map(data => map(data, newAddressData => new ServiceAddress(newAddressData)))
      .catch(error => this.http.handleHttpError(error));
  }
}
