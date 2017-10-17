import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { startsWith } from 'lodash';
import { ViewBillComponent } from 'app/shared/components/view-bill/view-bill.component';
import { ServiceAccountService } from 'app/core/serviceaccount.service';
import { InvoiceService } from 'app/core/invoiceservice.service';
import { PaymentsHistoryStore } from '../../core/store/paymentsstore';
import { InvoiceStore } from '../../core/store/invoicestore';

@Component({
  selector: 'mygexa-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [PaymentsHistoryStore, InvoiceStore]

})
export class PaymentsComponent implements OnInit, AfterViewInit, OnDestroy {

  private startsWith = startsWith;
  private ActiveServiceAccountSubscription: Subscription = null;
  private InvoiceStoreSubscription: Subscription = null;


  @ViewChild(ViewBillComponent) private viewBill: ViewBillComponent;

  constructor(
    private Router: Router,
    private ServiceAccountService: ServiceAccountService,
    private invoice_service: InvoiceService,
    private paymentsHistoryStore: PaymentsHistoryStore,
    private InvoiceStore: InvoiceStore
  ) {}

  ngOnInit() {
    this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
      result => {
        this.InvoiceStore.LoadLatestInvoiceDetails(result.Id);
        this.paymentsHistoryStore.LoadPaymentsHistory(result);
        // this.invoice_service.getLatestInvoiceId(result.Id).subscribe(
        //   resp => {
        //     this.invoice_service.getInvoice(resp, result.Id)
        //       .filter(() => !this.ActiveServiceAccountSubscription.closed)
        //       .subscribe(res => this.viewBill.PopulateItemizedBill(res));
        //   }
        // );
      }
    );

    this.InvoiceStoreSubscription = this.InvoiceStore.LatestInvoiceDetails
      .subscribe(
      Invoice => {
        if (Invoice) {
          this.viewBill.PopulateItemizedBill(Invoice);
        }
      }
    );
  }

  ngAfterViewInit() {
    // this.ActiveServiceAccountSubscription = this.ServiceAccountService.ActiveServiceAccountObservable.subscribe(
    //   result => {
    //     this.paymentsHistoryStore.LoadPaymentsHistory(result);
    //     this.InvoiceStore.LatestInvoiceId.subscribe(
    //       InvoiceId => {
    //         if (InvoiceId) {
    //           console.log('hi', InvoiceId);
    //           this.invoice_service.getInvoice(InvoiceId, result.Id)
    //             .filter(() => !this.ActiveServiceAccountSubscription.closed)
    //             .subscribe(res => this.viewBill.PopulateItemizedBill(res));
    //         }
    //         }
    //     );
    //     // this.invoice_service.getLatestInvoiceId(result.Id).subscribe(
    //     //   resp => {
    //     //     this.invoice_service.getInvoice(resp, result.Id)
    //     //       .filter(() => !this.ActiveServiceAccountSubscription.closed)
    //     //       .subscribe(res => this.viewBill.PopulateItemizedBill(res));
    //     //   }
    //     // );
    //   }
    //
    // );
  }

  ngOnDestroy() {
    this.ActiveServiceAccountSubscription.unsubscribe();
    if (this.InvoiceStoreSubscription) {
      this.InvoiceStoreSubscription.unsubscribe();
    }
  }
}
