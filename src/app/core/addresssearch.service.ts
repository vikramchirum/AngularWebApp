/**
 * Created by vikram.chirumamilla on 7/17/2017.
 */

import {Injectable} from '@angular/core';
import {Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {map} from 'lodash';

import {HttpClient} from './httpclient';
import {ServiceAddress} from './models/serviceaddress/serviceaddress.model';
import {ISearchAnnouncements} from './models/announcements/searchannouncementsrequest.model';
import {ISearchAddressRequest} from './models/serviceaddress/searchaddressrequest.model';

@Injectable()
export class AddressSearchService {

  constructor(private http: HttpClient) {
  }

  searchAddress(searchRequest: ISearchAddressRequest): Observable<ServiceAddress[]> {
    const relativePath = `/address_search/`;
    return this.http.search(relativePath, searchRequest)
      .map((response: Response) => response.json())
      .map(data => map(data, newAddressData => new ServiceAddress(newAddressData)))
      .catch(error => this.http.handleHttpError(error));
  }
}
