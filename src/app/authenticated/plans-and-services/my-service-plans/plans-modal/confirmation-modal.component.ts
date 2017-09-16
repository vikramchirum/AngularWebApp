/**
 * Created by vikram.chirumamilla on 9/14/2017.
 */

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import {environment} from 'environments/environment';


@Component({
  selector: 'mygexa-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit, AfterViewInit {

  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(){

  }

  public show(): void {
    alert('mama rey');
    this.confirmationModal.show();
  }

  public hideViewMyBillModal(): void {
    this.confirmationModal.hide();
  }
}
