import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { startsWith } from 'lodash';
import { ViewBillComponent } from 'app/shared/components/view-bill/view-bill.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements AfterViewInit, OnDestroy {

  private startsWith = startsWith;
  private ActiveServiceAccountSubscription: Subscription = null;

  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;

  constructor(
    private Router: Router,
    private ServiceAccountService: ServiceAccountService,
    private invoice_service: InvoiceService
  ) {}

  ngAfterViewInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => this.invoice_service.getInvoice(result.Latest_Invoice_Id)
        .filter(() => !this.ActiveServiceAccountSubscription.closed)
        .subscribe(res => this.viewBill.PopulateItemizedBill(res))
    );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
  }
}
