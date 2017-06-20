/**
 * Created by vikram.chirumamilla on 6/20/2017.
 */

import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { environment } from 'environments/environment';

@Injectable()
export class HttpClient extends Http {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.get(url, this.getRequestOptionArgs(options));
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.post(url, body, this.getRequestOptionArgs(options));
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.put(url, body, this.getRequestOptionArgs(options));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.getAbsoluteUrl(url);
    return super.delete(url, this.getRequestOptionArgs(options));
  }

  private getAbsoluteUrl(relativePath: string) {
    return  environment.Api_Url + relativePath;
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {

    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Ocp-Apim-Subscription-Key', environment.Api_Token);
    options.headers.append('bearer', 'token');
    return options;
  }
}
