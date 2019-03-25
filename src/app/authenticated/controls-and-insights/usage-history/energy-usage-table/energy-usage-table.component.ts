import { Component, OnDestroy, ViewChild } from '@angular/core';

import { reverse, toNumber, startsWith } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';
import { Router } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'mygexa-energy-usage-table',
  templateUrl: './energy-usage-table.component.html',
  styleUrls: ['./energy-usage-table.component.scss']
})
export class EnergyUsageTableComponent implements OnDestroy {

  @ViewChild("baseChart") chart: BaseChartDirective;

  public startsWith = startsWith;
  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;
  public isDataAvailable = false;

  /* Table and Pagination Data */
  public tablePage = 1;
  public tableData: any[] = [];

  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

  constructor(
    private usageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService,
    public Router: Router
  ) {
    this.ServiceAccountsSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      activeServiceAccount => {
        this.activeServiceAccount = activeServiceAccount;
        this.getUsageHistoryByServiceAccountId();
      }
    );
  }

  ngOnDestroy() {
    // Clean up our subscribers to avoid memory leaks.
    this.ServiceAccountsSubscription.unsubscribe();
  }

  get totalItems(): number {
    return this.tableData.length;
  }

  private getEntries(page: number) {
    const index = (page - 1) * 10;
    const extent = index + 10;
    if (extent > this.tableData.length) {
      return this.tableData.slice(index);
    }
    return this.tableData.slice(index, extent);
  }

  get currentPage() {
    return this.getEntries(this.tablePage);
  }

  public pageChanged(event: any): void {
    this.tablePage = event.page;
  }

  getUsageHistoryByServiceAccountId() {
    if (this.activeServiceAccount) {
      this.usageHistoryService.getUsageHistory(toNumber(this.activeServiceAccount.Id))
        .subscribe(usageHistory => {
          this.tableData = reverse(usageHistory);
          this.isDataAvailable = true;
        });
    }
  }
}
