/**
 * Created by patrick.purcell on 10/17/2017.
 */
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

import { DocumentType } from './models/enums/documenttype';
import { ITduAvailabilityResult } from "./models/availabledate/tduAvailabilityResult.model";
import { ServiceType } from "./models/enums/serviceType";
import { TduAction } from "./models/enums/tduAction";

@Injectable()
export class CalendarService {

  constructor() {
  }


  getCalendarData( tduAvailabilityResult: ITduAvailabilityResult, serviceType: ServiceType ) {
    var result = {
      availableDates: [],
      unavailableDates: [],
      alertDates: [],
      startDate: null,
      endDate: null,
      pricingMessage: ''
    };

    for ( var index = 0; index < tduAvailabilityResult.Dates.length; index++ ) {
      var currentDate = tduAvailabilityResult.Dates[ index ];
      if ( currentDate.Actions && currentDate.Actions.length ) {
        var has_valid_action = false;
        var has_alert_action = false;
        for ( var action of currentDate.Actions ) {
          if ( serviceType === ServiceType.MoveIn ) {
            if ( action === TduAction.Priority_Move_In ) {
              has_valid_action = true;
              has_alert_action = true;
            }
            else if ( action === TduAction.Standard_Move_In ) {
              has_valid_action = true;
            }
          }
          else {
            if ( action === TduAction.Self_Selected_Switch ) {
              has_valid_action = true;
            }
          }
        }
        if ( has_valid_action ) {
          result.availableDates.push( this.formatCalendarDate( currentDate.Date ) );
          if ( !result.startDate ) {
            var previous = new Date( currentDate.Date );
            previous.setDate( previous.getDate() - 1 );
            result.startDate = this.formatCalendarDate( previous );
          }

          var next = new Date( currentDate.Date );
          next.setDate( next.getDate() + 1 );
          result.endDate = this.formatCalendarDate( next );
        }
        else {
          result.unavailableDates.push( this.formatCalendarDate( currentDate.Date ) );
        }
        if ( has_alert_action ) {
          result.alertDates.push( this.formatCalendarDate( currentDate.Date ) );
        }

      }
      else {
        result.unavailableDates.push( this.formatCalendarDate( currentDate.Date ) );
      }
    }


    var priority_price = null;
    var standard_price = null;
    var switch_price = null;
    for ( let price of tduAvailabilityResult.Prices ) {
      switch ( price.Action ) {
        case TduAction.Priority_Move_In:
          priority_price = price.Price;
          break;
        case TduAction.Standard_Move_In:
          standard_price = price.Price;
          break;
        case TduAction.Self_Selected_Switch:
          switch_price = price.Price;
          break;
      }
    }

    var has_pricing = priority_price !== null && standard_price !== null && switch_price !== null;

    if (has_pricing) {
      if ( serviceType == ServiceType.MoveIn ) {
        result.pricingMessage = 'For dates marked on the calendar with a red circle the TDU will charge you $' + priority_price + '.  All other dates will cost $' + standard_price;
      }
      else {
        result.pricingMessage = 'For any date picked the TDU will charge you $' + switch_price;
      }
    }
    else{
      result.pricingMessage = 'There may be extra charges from the TDU to perform this action.';
    }

    return result;
  }

  formatCalendarDate( date ) {
    var new_date = new Date( date );
    console.log( date );
    console.log( new_date );
    var result = {
      year: new_date.getUTCFullYear(),
      month: new_date.getUTCMonth() + 1,
      day: new_date.getUTCDate()
    };
    console.log( result )
    return result;
  };

}
