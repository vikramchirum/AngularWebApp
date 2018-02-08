
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from './httpclient';
import { ISearchTransferRequest } from 'app/core/models/transfers/searchtransferrequest.model';
import { TransferRecord } from 'app/core/models/transfers/transfer-response.model';
import { Response } from '@angular/http/';
import { map } from 'rxjs/operator/map';

@Injectable()
export class TransferService {

  constructor(private http: HttpClient) { }

  submitMove(transferRequest): Observable<string> {
    console.log('transferRequest......', JSON.stringify(transferRequest));
    return this.http.post(`/Transfer_Service`, JSON.stringify(transferRequest))
      .map(res => {
        res.json();
        console.log('res', res.json());
      })
      .catch(error => this.http.handleHttpError(error));
  }

  searchTransfers(searchRequest: ISearchTransferRequest): Observable<TransferRecord[]> {
    console.log('searchRequest...', JSON.stringify(searchRequest));

    const params: URLSearchParams = new URLSearchParams();
    for (const key in searchRequest) {
      if (searchRequest.hasOwnProperty(key)) {
        const val = searchRequest[key];
        params.set(key, val);
      }
    }

    const relativePath = `/Transfer_Service?option.current_Service_Account_Id=${searchRequest.Current_Service_Account_Id}`;
    return this.http.get(relativePath)
      .map((response: Response) => { return <TransferRecord[]>response.json(); })
      .catch(error => this.http.handleHttpError(error));
  }
}
