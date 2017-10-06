import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap';

import { IErrorResponse } from 'app/core/models/error/errorresponse';

@Component({
  selector: 'mygexa-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  @ViewChild('errorModal') public errorModal: ModalDirective;
  errorResponse: IErrorResponse;

  constructor() {
  }

  ngOnInit() {
  }

  public hideErrorModal(): void {
    this.errorModal.hide();
  }

  public showErrorModal(errorResponse: IErrorResponse): void {

    if (!errorResponse) {
      return;
    }
    this.errorResponse = errorResponse;
    this.errorModal.show();
  }
}
