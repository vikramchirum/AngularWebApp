import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { filter, forEach, clone } from 'lodash';
import { isFunction } from 'lodash';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';

import { IInvoiceLineItem } from 'app/core/models/invoices/invoicelineitem.model';
import { IInvoice } from 'app/core/models/invoices/invoice.model';

import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { UtilityService } from 'app/core/utility.service';

@Component( {
  selector: 'mygexa-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: [ './view-bill.component.scss' ],
  animations: [ trigger(
    'openCloseGexaCharges',
    [
      state( 'collapsed, void', style( { 'max-height': '0px' } ) ),
      state( 'expanded', style( { 'max-height': '*' } ) ),
      transition(
        'collapsed <=> expanded',[] )
    ] ),
    trigger(
      'openCloseTDUCharges',
      [
        state( 'collapsed, void', style( { 'max-height': '0px' } ) ),
        state( 'expanded', style( { 'max-height': '*' } ) ),
        transition(
          'collapsed <=> expanded', [] )
      ] ),
    trigger(
      'openCloseTaxCharges',
      [
        state( 'collapsed, void', style( { height: '0px' } ) ),
        state( 'expanded', style( { height: '*' } ) ),
        transition(
          'collapsed <=> expanded', [] )
      ] )
  ],
} )
export class ViewBillComponent implements OnInit {

  @ViewChild( 'gaugeText' ) gaugeText;
  @ViewChild( 'gauge' ) gauge;
  GexaChargesState: string;
  TDUChargesState: string;
  TaxChargesState: string;
  clearTimeout = null;
  clearIsDone = null;
  togg: boolean = null;
  doughnutChartOptions: any = Observable.of( {} );
  doughnutChartDataSet = Observable.of( [ '0', '0', '0', '0' ] );

  totalBill = '0.00';
  gexaCharges = '0.00';
  tduCharges = '0.00';
  taxCharges = '0.00';
  dollarAmountFormatter: string;

  @Input() bill_object: IInvoice;

  error: string = null;
  public bill_item_details: IInvoiceLineItem[] = [];
  public bill_item_details_gexa_charges: IInvoiceLineItem[] = [];
  public bill_item_details_other_charges: IInvoiceLineItem[] = [];
  public bill_item_details_TDU_charges: IInvoiceLineItem[] = [];
  public bill_item_details_tax: IInvoiceLineItem[] = [];

  public invoice_num: number;
  public invoice_date: Date;

  invoicesUrl: string;
  serviceAccountId: string;
  toggleGexa: boolean = null;
  toggleTDU: boolean = null;
  toggleTax: boolean = null;

  private openCharges = [];
  private ActiveServiceAccountSubscription: Subscription = null;
  private tduName: string;

  constructor( private invoiceService: InvoiceService, private serviceAccountService: ServiceAccountService
    , private utilityService: UtilityService, private decimalPipe: DecimalPipe ) {
    this.togg = false;
    this.collapse( '' );
    this.toggleGexa = this.toggleTDU = this.toggleTax = false;
    this.dollarAmountFormatter = environment.DollarAmountFormatter;
    this.doughnutChartOptions = Observable.of( {
      cutoutPercentage: 75,
      tooltips: {
        callbacks: {
          label: ( tooltipItem ) => {
            return [
              ` GEXA Charges $${this.gexaCharges}`,
              ` TAX $${this.taxCharges}`,
              ` ${this.tduName}  Charges $${this.tduCharges}`
            ][ tooltipItem.index ];
          }
        }
      }
    } );
  }

  toggle( section: string ) {
    console.log( 'section', section );
    switch ( section ) {
      case 'GexaCharges': {
        this.toggleGexa = !this.toggleGexa;
        if ( this.toggleGexa ) {
          this.expand( section );
        } else {
          this.collapse( section );
        }
        break;
      }
      case 'TDUCharges': {
        this.toggleTDU = !this.toggleTDU;
        if ( this.toggleTDU ) {
          this.expand( section );
        } else {
          this.collapse( section );
        }
        break;
      }
      case 'TaxCharges': {
        this.toggleTax = !this.toggleTax;
        if ( this.toggleTax ) {
          this.expand( section );
        } else {
          this.collapse( section );
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  expand( section: string ) {
    switch ( section ) {
      case 'GexaCharges': {
        this.GexaChargesState = 'expanded';
        break;
      }
      case 'TDUCharges': {
        this.TDUChargesState = 'expanded';
        break;
      }
      case 'TaxCharges': {
        this.TaxChargesState = 'expanded';
        break;
      }
      default: {
        this.GexaChargesState = '';
        this.TDUChargesState = '';
        this.TaxChargesState = '';
        break;
      }
    }
  }

  collapse( section: string ) {
    switch ( section ) {
      case 'GexaCharges': {
        this.GexaChargesState = 'collapsed';
        break;
      }
      case 'TDUCharges': {
        this.TDUChargesState = 'collapsed';
        break;
      }
      case 'TaxCharges': {
        this.TaxChargesState = 'collapsed';
        break;
      }
      default: {
        this.GexaChargesState = 'collapsed';
        this.TDUChargesState = 'collapsed';
        this.TaxChargesState = 'collapsed';
        break;
      }
    }
  }

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.tduName = result.TDU_Name;
        this.serviceAccountId = result.Id;
        if ( this.bill_object ) {
          this.PopulateItemizedBill( this.bill_object );
        }
      }
    );
  }

  public PopulateItemizedBill( bill_object: IInvoice ) {
    const invoice_id = +(bill_object.Invoice_Id);
    this.invoicesUrl = environment.Documents_Url.concat( `/invoice/generate/${invoice_id}` );
    this.invoiceService.getItemizedInvoiceDetails( invoice_id, this.serviceAccountId )
      .subscribe(
        bill_item_details => {
          if ( !bill_item_details ) {
            return;
          }
          this.openCharges = [];
          this.bill_object = bill_object;
          this.invoice_num = invoice_id;
          this.invoice_date = bill_object.Invoice_Date;
          this.bill_item_details = bill_item_details;
          this.bill_item_details_TDU_charges = filter( this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TDSP') );
          this.bill_item_details_gexa_charges = filter( this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA'
          && item.Bill_Line_Item_Sub_Type === 'Energy') );
          this.bill_item_details_other_charges = filter( this.bill_item_details, item => (item.Bill_Line_Item_Type === 'GEXA'
          && item.Bill_Line_Item_Sub_Type === 'None') );
          this.bill_item_details_tax = filter( this.bill_item_details, item => (item.Bill_Line_Item_Type === 'TAX') );

          this.LoadGauge();
        }
      );
  }

  /**
   * Calculate the total of a charge's items.
   * @param charge
   * @returns {number}
   */
  public subtotal( charge: any ) {
    let total = 0;
    forEach( charge, item => total += item[ 'Amount' ] );
    return total;
  }

  /**
   * Return whether a charge is considered to be open.
   * @param charge
   * @returns {boolean}
   */
  public chargeOpened( charge ) {
    return this.openCharges.indexOf( charge ) >= 0;
  }

  /**
   * Push/pull a charge from the array of open charges.
   * @param charge
   */
  public chargeToggle( charge ) {
    const indexOf = this.openCharges.indexOf( charge );
    if ( indexOf < 0 ) {
      this.openCharges.push( charge );
    } else {
      this.openCharges.splice( indexOf, 1 );
    }
  }

  chartClicked( $event ) {
    if ( $event.active && $event.active[ 0 ] ) {
      const index = $event.active[ 0 ]._index;
      switch ( index ) {
        case 0 :
          this.chargeToggle( this.bill_item_details_gexa_charges );
          this.toggle( 'GexaCharges' );
          break;

        case 1 :
          this.chargeToggle( this.bill_item_details_tax );
          this.toggle( 'TaxCharges' );
          break;

        case 2:
          this.chargeToggle( this.bill_item_details_TDU_charges );
          this.toggle( 'TDUCharges' );
          break;
      }
    }
  }

  public downloadInvoice( $event ) {

    $event.preventDefault();
    $event.stopPropagation();

    const invoiceId = this.bill_object.Invoice_Id;
    this.invoiceService.getInvoicePDF( invoiceId ).subscribe(
      data => this.utilityService.downloadFile( data )
    );
  }

  LoadGauge() {

    this.gexaCharges = this.decimalPipe.transform( this.subtotal( this.bill_item_details_gexa_charges ) + this.subtotal( this.bill_item_details_other_charges ), this.dollarAmountFormatter );
    this.tduCharges = this.decimalPipe.transform( this.subtotal( this.bill_item_details_TDU_charges ), this.dollarAmountFormatter );
    this.taxCharges = this.decimalPipe.transform( this.subtotal( this.bill_item_details_tax ), this.dollarAmountFormatter );
    this.totalBill = this.decimalPipe.transform( this.subtotal( this.bill_item_details_gexa_charges )
      + this.subtotal( this.bill_item_details_other_charges )
      + this.subtotal( this.bill_item_details_TDU_charges )
      + this.subtotal( this.bill_item_details_tax ), this.dollarAmountFormatter );

    this.buildChart();
  }

  buildChart(): void {

    this.clearFirst( () => {

      this.doughnutChartDataSet = Observable.of( [ this.gexaCharges, this.taxCharges, this.tduCharges ] );

      try {

        const gaugeText = this.getTextCanvas();

        // Print out the message according to the short-term window.
        gaugeText.font = '40pt sans-serif';
        gaugeText.fillStyle = 'black';
        gaugeText.fillText( 'Click any Section', 500, 650 );
        gaugeText.globalCompositeOperation = 'source-over';

        gaugeText.textAlign = 'center';
        gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
        gaugeText.font = 'bold 100pt sans-serif';
        gaugeText.fillText( `${this.totalBill}`, 500, 500 );
        gaugeText.textAlign = 'end';

        gaugeText.fillStyle = 'rgba(46,177,52,1.0)';
        gaugeText.font = 'bold 100pt sans-serif';

        if ( this.totalBill.length === 6 ) {
          gaugeText.fillText( `$      `, 500, 475 );
        } else if ( this.totalBill.length === 5 ) {
          gaugeText.fillText( `$     `, 500, 475 );
        } else {
          gaugeText.fillText( `$    `, 500, 475 );
        }
        gaugeText.textAlign = 'end';
        
        
        gaugeText.textAlign = 'center';
        gaugeText.fillStyle = 'rgba(0,0,0,1.0)';
        gaugeText.font = 'bold 48pt sans-serif';
        gaugeText.fillText('Current Charges', 500, 325);

        
      } catch ( e ) {
        // If thrown, the browser likely does not support the HTML5 canvas API/object.
        console.error( e );
      }
    } );
  }

  clearFirst( callback: Function ) {

    // If we haven't yet drawn any charts, have no delay on the initial.
    const delay = this.clearIsDone === null ? 0 : 1000;

    this.clearIsDone = false;

    // Stop any previous jobs/timeouts.
    if ( this.clearTimeout ) {
      clearTimeout( this.clearTimeout );
    }

    // Clear the doughnut chart (starting its' animation.)
    this.doughnutChartDataSet = Observable.of( [ '0', '0', '0' ] );

    // Try to clear the gauge's text.
    try {
      this.getTextCanvas();
    } catch ( e ) {
      // If thrown, the browser likely does not support the HTML5 canvas API/object.
      console.error( e );
    }

    // Run the callback after the delay (once the animation has finished.)
    this.clearTimeout = setTimeout( () => {
      this.clearIsDone = true;

      if ( isFunction( callback ) ) {
        callback();
      }
    }, delay );
  }

  getTextCanvas() {
    const gaugeText = this.gaugeText.nativeElement.getContext( '2d' );
    gaugeText.clearRect( 0, 0, 1000, 1000 );
    gaugeText.fillStyle = 'blue';
    gaugeText.textAlign = 'center';
    return gaugeText;
  }
}
