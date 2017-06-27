import { Component, OnInit } from '@angular/core';
import { MyBillService } from './my-bill.service';

@Component({
  selector: 'mygexa-my-bill',
  templateUrl: './my-bill.component.html',
  styleUrls: ['./my-bill.component.scss'],
  providers: [ MyBillService ]
})
export class MyBillComponent implements OnInit {
  errorMessage: string;
  billingAccounts:any = null;

  constructor(private myBillService: MyBillService) { }

  ngOnInit() {
    this.getMyBill();
  }



  getMyBill() {
    //Id should be dynamic. On selection of billing address, We should get billing account Id amd pass it to service
    this.myBillService.getMyBill('77054')
                     .then(
                       billingAccounts => {
                         this.billingAccounts = billingAccounts
                       },
                       error =>  this.errorMessage = <any>error);
  }
}
