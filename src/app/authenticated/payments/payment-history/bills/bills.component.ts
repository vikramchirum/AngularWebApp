<<<<<<< HEAD
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { Subscription } from 'rxjs/Subscription';
import { environment } from 'environments/environment';
import { IInvoice } from 'app/core/models/invoices/invoice.model';
import { ColumnHeader } from 'app/core/models/columnheader.model';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { ViewMyBillModalComponent } from './view-my-bill-modal/view-my-bill-modal.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { IInvoiceSearchRequest } from 'app/core/models/invoices/invoicesearchrequest.model';

@Component({
  selector: 'mygexa-payment-history-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit, AfterViewInit, OnDestroy {

  public config: any;
  public columnHeaders: ColumnHeader[] = [
    { title: 'Bill Date',       name: 'Invoice_Date',    sort: 'desc', type: 'date' },
    { title: 'Usage',           name: 'Total_Usage',           sort: '',     type: '' },
    { title: 'Due Date',        name: 'Due_Date',        sort: '',     type: 'date' },
    { title: 'Current Charges', name: 'Current_Charges', sort: '',     type: 'dollar' },
    { title: 'Total',           name: 'Amount_Due',      sort: '',     type: 'dollar' }
  ];
  public rows: any[] = [];
  public documentsUrl;

  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems = 0;
  public Invoices: IInvoice[];

  private ActiveServiceAccountSubscription: Subscription = null;
  private serviceAccountId: number;

  @ViewChild('viewMyBillModal') viewMyBillModal: ViewMyBillModalComponent;

  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe
    , private invoiceService: InvoiceService, private serviceAccountService: ServiceAccountService) {
  }
  public showViewMyBillModal(row: IInvoice) {
    this.viewMyBillModal.show(row);
  }

  ngOnInit() {
    this.documentsUrl = environment.Documents_Url;
    this.config = {
      paging: true,
      sorting: {columnHeaders: this.columnHeaders},
    };
  }

  ngAfterViewInit() {
    this.ActiveServiceAccountSubscription = this.serviceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.serviceAccountId = +(result.Id);
        const invoiceSearchRequest = {} as IInvoiceSearchRequest;
        invoiceSearchRequest.Service_Account_Id = this.serviceAccountId;
        this.invoiceService.getInvoicesCacheable(invoiceSearchRequest).subscribe(bills => {
          this.Invoices = bills;
          this.onChangeTable(this.config);
        });
      }
    );
  }

  public getData(row: any, columnHeader: ColumnHeader): any {
    if (!row) {
      return '';
    }

    if (columnHeader.type === 'date') {
      return this.datePipe.transform(row[columnHeader.name], 'd MMM y');
    }

    if (columnHeader.type === 'dollar') {
      return this.currencyPipe.transform(row[columnHeader.name], 'USD', true, '.2');
    }

    if (columnHeader.name === 'Usage') {
      return `${row[columnHeader.name]}kwh`;
    }

    return row[columnHeader.name];
  }

  public getInvoiceId(row: any): any {
    if (!row) {
      return '';
    }
    return row['Invoice_Id'];
  }

  public onChangeTable(config: any, pageNumber?: number): any {
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    const sortedData = this.changeSort(this.Invoices, this.config);
    this.rows = sortedData;
    this.totalItems = sortedData.length;
  }

  public changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }
    const columnHeaders = this.config.sorting.columnHeaders || [];
    // get the first column by default that has a sort value
    const columnWithSort: ColumnHeader = columnHeaders.find((columnHeader: ColumnHeader) => {
      /* Checking if sort prop exists and column needs to be sorted */
      if (columnHeader.hasOwnProperty('sort') && columnHeader.sort !== '') {
        return true;
      }
    });

    return data.sort((previous: any, current: any) => {
      if (previous[columnWithSort.name] > current[columnWithSort.name]) {
        return columnWithSort.sort === 'desc'
          ? -1
          : 1;
      } else if (previous[columnWithSort.name] < current[columnWithSort.name]) {
        return columnWithSort.sort === 'asc'
          ? -1
          : 1;
      }
      return 0;
    });
  }

  public columnSortWay(columnHeader: ColumnHeader): 'asc' | 'desc' | '' {
    if (columnHeader.sort || columnHeader.sort !== '') {
      return columnHeader.sort;
    } else {
      return '';
    }
  }

  public sortByColumn(columnToSort: ColumnHeader) {
    const sorting: Array<ColumnHeader> = Object.assign({}, this.config.sorting).columnHeaders;
    const sorted = sorting.map((columnHeader: ColumnHeader) => {
      if (columnToSort.name === columnHeader.name) {
        const newSort = columnHeader.sort === 'asc'
          ? 'desc'
          : 'asc';
        return Object.assign(columnHeader, {sort: newSort});
      } else {
        return Object.assign(columnHeader, {sort: ''});
      }
    });

    const config = Object.assign({}, this.config, {
      sorting: {columns: sorted}
    });

    this.currentPage = 1;
    this.onChangeTable(config);
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
