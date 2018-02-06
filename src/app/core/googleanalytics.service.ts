/**
 * Created by vikram.chirumamilla on 2/5/2018.
 */

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare const ga: any;
@Injectable()
export class GoogleAnalyticsService {
  public postEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
