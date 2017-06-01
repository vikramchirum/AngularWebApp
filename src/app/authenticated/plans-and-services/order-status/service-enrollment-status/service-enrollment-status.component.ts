import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mygexa-service-enrollment-status',
  templateUrl: './service-enrollment-status.component.html',
  styleUrls: ['./service-enrollment-status.component.scss']
})
export class ServiceEnrollmentStatusComponent implements OnInit {
  isTransactionDisplay : boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleViewTransaction($event) {
    $event.preventDefault();
    this.isTransactionDisplay = !this.isTransactionDisplay;
  }
}
