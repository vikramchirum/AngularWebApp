import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Bill, BillService } from 'app/core/Bill';

@Component({
  selector: 'mygexa-current-charges',
  templateUrl: './current-charges.component.html',
  styleUrls: ['./current-charges.component.scss']
})
export class CurrentChargesComponent implements OnInit {

  private Bill: Bill = null;

  constructor(
    private BillService: BillService,
    private Router: Router
  ) { }

  ngOnInit() {
    // Get the bills to show the current.
    this.BillService.getBills()
      .then((bills: Bill[]) => this.Bill = bills[0])
      .catch((err: any) => console.log(err));
  }

  make_a_payment() {
    if (this.Router.url === '/payments/make-payment') {
      // Do the checkout here:
      alert('make a payment / checkout');
    } else {
      this.Router.navigate(['/payments/make-payment']);
    }
  }

}
