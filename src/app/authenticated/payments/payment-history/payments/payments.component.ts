import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { BillingAccountService } from 'app/core/BillingAccount.service';
import { PaymentsHistoryService } from 'app/core/payments-history.service';
import { PaymentsHistory } from 'app/core/models/payments-history.model';
import { Subscription } from 'rxjs/Subscription';
import { ColumnHeader } from 'app/core/models/columnheader.model';

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  public config: any;
  public columnHeaders: ColumnHeader[] = [
    { title: 'Date', name: 'Payment_Date', sort: 'desc', type: 'date' },
    { title: 'Payment Amount', name: 'Amount_Paid', sort: '', type: 'dollar' },
    { title: 'Status', name: 'Payment_Status', sort: '', type: '' },
    { title: 'Payment Method', name: 'Payment_Type', sort: '', type: '' },
    { title: 'Payment Account', name: 'Payment_Source', sort: '', type: '' }
  ];
  public rows: any[] = [];

  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems = 0;
  public Payments: PaymentsHistory[];

  private ActiveBillingAccountSubscription: Subscription = null;

  constructor(
    private BillingAccountService: BillingAccountService,
    private PaymentsHistoryService: PaymentsHistoryService,
    private CurrencyPipe: CurrencyPipe,
    private DatePipe: DatePipe
  ) { }

  ngOnInit() {
    this.config = {
      paging: true,
      sorting: { columnHeaders: this.columnHeaders },
    };
    this.ActiveBillingAccountSubscription = this.BillingAccountService.ActiveBillingAccountObservable.subscribe(
      activeBillingAccount => {
        this.PaymentsHistoryService.GetPaymentsHistoryCacheable(activeBillingAccount).subscribe(
          PaymentsHistoryItems => {
            this.Payments = PaymentsHistoryItems;
            this.onChangeTable(this.config);
          }
        );
      }
    );
  }

  public getData(row: any, columnHeader: ColumnHeader): any {
    if (!row) {
      return '';
    }

    if (columnHeader.type === 'date') {
      return this.DatePipe.transform(row[columnHeader.name], 'd MMM y');
    }

    if (columnHeader.type === 'dollar') {
      return this.CurrencyPipe.transform(row[columnHeader.name], 'USD', true, '.2');
    }

    return row[columnHeader.name];
  }

  onChangeTable(config: any, pageNumber?: number): any {
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    const sortedData = this.changeSort(this.Payments, this.config);
    this.rows = sortedData;
    this.totalItems = sortedData.length;
  }

  changeSort(data: any, config: any): any {
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

  columnSortWay(columnHeader: ColumnHeader): 'asc' | 'desc' | '' {
    if (columnHeader.sort || columnHeader.sort !== '') {
      return columnHeader.sort;
    } else {
      return '';
    }
  }

  sortByColumn(columnToSort: ColumnHeader) {

    const sorting: ColumnHeader[] = Object.assign({}, this.config.sorting).columnHeaders;
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
    this.ActiveBillingAccountSubscription.unsubscribe();
  }

}
