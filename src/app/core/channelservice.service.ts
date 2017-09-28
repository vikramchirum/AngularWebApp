import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { IChannel } from './models/channel/channel.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from './httpclient';

@Injectable()
export class ChannelService {

constructor(private http: HttpClient) {}
  getChannelId(): Observable<IChannel[]> {
    return this.http.get(`/Channels?option.email_Address=${String(environment.Client_Email_Addresses)}`)
      .map(data => { data.json(); console.log('Channel', data.json()); return data.json(); })
      .map(data => <IChannel[]>data)
      .catch(error => this.http.handleHttpError(error));
  }
}

