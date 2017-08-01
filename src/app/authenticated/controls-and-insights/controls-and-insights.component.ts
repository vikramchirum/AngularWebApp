import { Component, OnDestroy } from '@angular/core';

import { reverse, toNumber } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { UsageHistoryService } from 'app/core/usage-history.service';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-controls-and-insights',
  templateUrl: './controls-and-insights.component.html',
  styleUrls: ['./controls-and-insights.component.scss']
})
export class ControlsAndInsightsComponent implements OnDestroy {

  private activeServiceAccount: ServiceAccount = null;
  private ServiceAccountsSubscription: Subscription = null;
  private isDataAvailable = false;

  /* Table and Pagination Data */
  public tablePage = 1;
  public tableData: any[] = [];

  constructor(
    private usageHistoryService: UsageHistoryService,
    private ServiceAccountService: ServiceAccountService
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
