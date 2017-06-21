import { Component, OnInit } from '@angular/core';

import { Bill, BillService } from 'app/core/Bill';

@Component({
  selector: 'mygexa-current-charges',
  templateUrl: './current-charges.component.html',
  styleUrls: ['./current-charges.component.scss']
})
export class CurrentChargesComponent implements OnInit {

  Bill: Bill = null;

  constructor(
    private BillService: BillService
  ) { }

  ngOnInit() {
    this.BillService.getCurrentBill()
      .then((Bill: Bill) => this.Bill = Bill);
  }

}
