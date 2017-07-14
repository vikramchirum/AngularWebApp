import { Component, OnInit } from '@angular/core';

import MockData from './payments.mock-data.json';

interface IHistoryPayment {
  Id: string;
  date: Date;
  amount: number;
  status: string;
  method: string;
  account: string;
}

@Component({
  selector: 'mygexa-payment-history-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  Payments: IHistoryPayment[] = [];
  PaymentsSortingBy: string;
  PaymentsPage: number;
  PaymentsPerPage = 10;

  private PaymentsSortingByLesser: number = null;
  private PaymentsSortingByGreater: number = null;
  set PaymentsSortingByDesc(desc: boolean) {
    if (desc) {
      this.PaymentsSortingByLesser = 1;
      this.PaymentsSortingByGreater = -1;
    } else {
      this.PaymentsSortingByLesser = -1;
      this.PaymentsSortingByGreater = 1;
    }
  }
  get PaymentsSortingByDesc(): boolean {
    return this.PaymentsSortingByGreater === -1;
  }

  private sorting(a: IHistoryPayment, b: IHistoryPayment): number {
    if (a[this.PaymentsSortingBy] < b[this.PaymentsSortingBy]) {
      return this.PaymentsSortingByLesser;
    }
    if (a[this.PaymentsSortingBy] > b[this.PaymentsSortingBy]) {
      return this.PaymentsSortingByGreater;
    }
    return 0;
  }

  get currentPageOfPayments(): IHistoryPayment[] {
    const sorted = this.Payments.sort((a, b) => this.sorting(a, b));
    const index = this.PaymentsPage * this.PaymentsPerPage;
    const extent = index + this.PaymentsPerPage;
    if (extent > sorted.length) {
      return sorted.slice(index);
    }
    return sorted.slice(index, extent);
  }

  get currentPageNumber(): number {
    return this.PaymentsPage + 1;
  }
  get totalPages(): number {
    return Math.ceil(this.Payments.length / this.PaymentsPerPage);
  }

  nextPage(): void {
    this.PaymentsPage++;
  }

  gotoPage(index: number): void {
    this.PaymentsPage = index;
  }

  previousPage(): void {
    this.PaymentsPage--;
  }

  sortBy(attribute: string): void {
    if (this.PaymentsSortingBy === attribute) {
      this.PaymentsSortingByDesc = !this.PaymentsSortingByDesc;
    } else {
      this.PaymentsSortingBy = attribute;
      this.PaymentsSortingByDesc = true;
    }
  }

  constructor() {
    this.PaymentsPage = 0;
    this.PaymentsSortingBy = 'date';
    this.PaymentsSortingByDesc = true;
    this.Payments = MockData;
    // Process the mock data:
    for (const index in this.Payments) {
      if (this.Payments[index]) {
        this.Payments[index].date = new Date(this.Payments[index].date);
      }
    }
  }

  ngOnInit() {}

}
