import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { TDUService } from 'app/core/tdu.service';
import { ITDU } from 'app/core/models/tdu/tdu.model';
import { map, max } from 'lodash';

@Component( {
  selector: 'mygexa-tdu-charges',
  templateUrl: './tdu_charges.component.html',
  styleUrls: [ './tdu_charges.component.scss' ]
} )

export class TduChargesComponent implements OnInit {

  public TDUs: ITDU[];
  public last_updated: Date;

  constructor( private tdu_service: TDUService ) {
    this.tdu_service.getTDUS().subscribe(
      result => {
        this.TDUs = result;
        const dates = map( this.TDUs, ( item ) => {
          return new Date( item.Date_Last_Modified );
        } );
        this.last_updated = max( dates );
      }
    );
  }

  ngOnInit() {
  }

}
