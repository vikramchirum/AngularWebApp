import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { map } from 'lodash';
import { HttpClient } from './httpclient';
import { OrderStatus } from './models/order-status.model';

@Injectable()
export class OrderStatusService {

  constructor(private http: HttpClient) {
  }

  fetchOrderDetails(customerId): Observable<any[]> {
    return this.http
      .get(`/orders/${customerId}`)
      .map((response: Response) => this.processApiData(response))
      .map(data => map(data, orderDetails => new OrderStatus(orderDetails)))
      .catch(error => this.http.handleHttpError(error));
  }

  private processApiData(res: Response) {
    return res.json();
  }
}
