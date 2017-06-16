import { Component, OnInit } from '@angular/core';

import MockData from './ledger.mock-data.json';

interface IHistoryLedger {
  Id: string;
  date: Date;
  type: string;
  amount: number;
  balance: number;
}

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {

  Transactions: IHistoryLedger[] = [];
  TransactionsPage: number;
  TransactionsPerPage = 20;

  get currentPageOfTransactions(): IHistoryLedger[] {
    const index = this.TransactionsPage * this.TransactionsPerPage;
    const extent = index + this.TransactionsPerPage;
    if (extent > this.Transactions.length) {
      return this.Transactions.slice(index);
    }
    return this.Transactions.slice(index, extent);
  }

  get currentPageNumber(): number {
    return this.TransactionsPage + 1;
  }
  get totalPages(): number {
    return Math.ceil(this.Transactions.length / this.TransactionsPerPage);
  }

  nextPage(): void {
    this.TransactionsPage++;
  }

  gotoPage(index: number): void {
    this.TransactionsPage = index;
  }

  previousPage(): void {
    this.TransactionsPage--;
  }

  constructor() {
    this.TransactionsPage = 0;
    this.Transactions = MockData;
    // Process the mock data.
    for (const index in this.Transactions) {
      if (this.Transactions[index]) {
        this.Transactions[index].date = new Date(this.Transactions[index].date);
      }
    }
  }

  ngOnInit() {}

  openBill(bill: IHistoryLedger) {
    alert(`open up bill: ${bill.Id}`);
  }

}
