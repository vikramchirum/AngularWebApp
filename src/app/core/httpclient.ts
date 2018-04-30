/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { Injectable } from '@angular/core';
import {
  ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers, XHRBackend,
  URLSearchParams, ResponseContentType
} from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { get, isPlainObject } from 'lodash';
import { environment } from 'environments/environment';

import { IErrorResponse } from './models/error/errorresponse';

@Injectable()
export class HttpClient extends Http {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  public search(url: string, searchRequest?: Object): Observable<Response> {

    let params: URLSearchParams = null;
    if (isPlainObject(searchRequest)) {
      params = this.getURLSearchParams(searchRequest);
    }

    url = this.getAbsoluteUrl(url);
    const options = this.getRequestOptionArgs();
    if (params != null) {
      options.params = params;
    }

    return super.get(url, options);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.get(url, this.getRequestOptionArgs(options));
  }

  public downloadFile(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    const blobOptions = this.getRequestOptionArgs(options, true);
    blobOptions.responseType = ResponseContentType.Blob;
    return super.get(url, blobOptions);
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.post(url, body, this.getRequestOptionArgs(options));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.put(url, body, this.getRequestOptionArgs(options));
  }

  public delete(url: string, deleteRequest?: object): Observable<Response> {

    let params: URLSearchParams = null;
    if (isPlainObject(deleteRequest)) {
      params = this.getURLSearchParams(deleteRequest);
    }

    url = this.getAbsoluteUrl(url);
    const options = this.getRequestOptionArgs();
    if (params != null) {
      options.params = params;
    }

    return super.delete(url, options);
  }

  private getAbsoluteUrl(relativePath: string) {
    return  environment.Api_Url + relativePath;
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs, isblob = false): RequestOptionsArgs {

    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    if (!isblob) {
      if (!options.headers.has('Content-Type')) {
        options.headers.append('Content-Type', 'application/json');
      }
    }

    options.headers.append('Ocp-Apim-Subscription-Key', environment.Api_Token);
    options.headers.append('API_TOKEN', localStorage.getItem('gexa_auth_token'));
    return options;
  }

  handleHttpError(error: Response | any) {

    // In a real world app, you might use a remote logging infrastructure
    console.log('Error', error);
    let errMsg: string;
    let DisplayErrMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      DisplayErrMsg = body.Message;
      const err = get(body, 'error', JSON.stringify(body));
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    const errorResponse = {} as IErrorResponse;
    errorResponse.StatusCode = +error.status;
    errorResponse.Message = DisplayErrMsg;

    console.error(errMsg);
    if ((error.status === 401 || error.status === 403)) {
      console.log('The token has expired or the user is not authorised. Please log back again.');
      this.logout(true);
    } else if (error.status === 400) {
      console.log(DisplayErrMsg);
      return Observable.throw(errorResponse);
    } else if (error.status === 500) {
      const internalServerErrorMessage = { Message: 'We\'re sorry, something didn\'t work. Please try again' };
      console.log(DisplayErrMsg);
      return Observable.throw(internalServerErrorMessage);
    } else if (error.status === 503) {
      if (DisplayErrMsg === 'User locked out') {
        return Observable.throw({Message: 'Account has been locked. You may reset your password if you have forgotten it.'});
      }
      return Observable.throw({Message: DisplayErrMsg});
    } else {
      console.log(errMsg);
      return Observable.throw(errMsg);
    }
  }

  logout(maintainRouteState?: boolean) {
    this.clearLocalStorage();
    if (maintainRouteState) {
      (<any>window).location.reload(true);
    } else {
      const url = window.location.href;
      const arr = url.split('/');
      const result = arr[0] + '//' + arr[2] + '/login/';
      window.location.href = result + '?' + new Date().getMilliseconds();
    }
  }

  clearLocalStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  private getURLSearchParams(searchRequest): URLSearchParams {
    const params: URLSearchParams = new URLSearchParams();
    if (isPlainObject(searchRequest)) {
      for (const key in searchRequest) {
        if (searchRequest.hasOwnProperty(key)) {
          const val = searchRequest[key];
          params.set(key, val);
        }
      }
    }
    return params;
  }
}

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
  return new HttpClient(xhrBackend, requestOptions);
}

const HttpClientProvider = {
  provide: HttpClient,
  useFactory: httpFactory,
  deps: [ XHRBackend, RequestOptions ]
};

export { HttpClientProvider as HttpClientService };
