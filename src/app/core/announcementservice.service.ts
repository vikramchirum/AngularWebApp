import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { map } from 'lodash';
import { HttpClient } from './httpclient';
import { IAnnouncement } from './models/announcements/announcement.model';
import { ISearchAnnouncements } from './models/announcements/searchannouncementsrequest.model';

@Injectable()
export class AnnouncementsService {

  constructor(private http: HttpClient) {
  }
  searchAnnouncements (searchRequest: ISearchAnnouncements): Observable<IAnnouncement[]> {
    const relativePath = `/announcements/`;
    return this.http.search(relativePath, searchRequest)
      .map((response: Response) => response.json())
      .catch(error => this.http.handleHttpError(error));
  }
}
