import { Component, OnInit } from '@angular/core';

import MockData from './bills.mock-data.json';

interface IHistoryBill {
  Id: string;
  charges: number;
  date: Date;
  due: Date;
  total: number;
  usage: number;
}

@Component({
  selector: 'mygexa-payment-history-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {

  Bills: IHistoryBill[] = [];
  BillsSortingBy: string;
  BillsPage: number;
  BillsPerPage = 10;

  private BillsSortingByLesser: number = null;
  private BillsSortingByGreater: number = null;
  set BillsSortingByDesc(desc: boolean) {
    if (desc) {
      this.BillsSortingByLesser = 1;
      this.BillsSortingByGreater = -1;
    } else {
      this.BillsSortingByLesser = -1;
      this.BillsSortingByGreater = 1;
    }
  }
  get BillsSortingByDesc(): boolean {
    return this.BillsSortingByGreater === -1;
  }

  private sorting(a: IHistoryBill, b: IHistoryBill): number {
    if (a[this.BillsSortingBy] < b[this.BillsSortingBy]) {
      return this.BillsSortingByLesser;
    }
    if (a[this.BillsSortingBy] > b[this.BillsSortingBy]) {
      return this.BillsSortingByGreater;
    }
    return 0;
  }

  get currentPageOfBills(): IHistoryBill[] {
    const sorted = this.Bills.sort((a, b) => this.sorting(a, b));
    const index = this.BillsPage * this.BillsPerPage;
    const extent = index + this.BillsPerPage;
    if (extent > sorted.length) {
      return sorted.slice(index);
    }
    return sorted.slice(index, extent);
  }

  get currentPageNumber(): number {
    return this.BillsPage + 1;
  }
  get totalPages(): number {
    return Math.ceil(this.Bills.length / this.BillsPerPage);
  }

  nextPage(): void {
    this.BillsPage++;
  }

  gotoPage(index: number): void {
    this.BillsPage = index;
  }

  previousPage(): void {
    this.BillsPage--;
  }

  sortBy(attribute: string): void {
    if (this.BillsSortingBy === attribute) {
      this.BillsSortingByDesc = !this.BillsSortingByDesc;
    } else {
      this.BillsSortingBy = attribute;
      this.BillsSortingByDesc = true;
    }
  }

  constructor() {
    this.BillsPage = 0;
    this.BillsSortingBy = 'due';
    this.BillsSortingByDesc = true;
    this.Bills = MockData;
    // Process the mock data:
    for (const index in this.Bills) {
      if (this.Bills[index]) {
        this.Bills[index].date = new Date(this.Bills[index].date);
        this.Bills[index].due = new Date(this.Bills[index].due);
      }
    }
  }

  ngOnInit() {}

  openUpBill(bill: IHistoryBill) {
    alert(`open up bill: ${bill.Id}`);
  }

}
