import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'mygexa-select-plan-modal-dialog',
  templateUrl: './select-plan-modal-dialog.component.html',
  styleUrls: ['./select-plan-modal-dialog.component.scss']
})
export class SelectPlanModalDialogComponent implements OnInit {


  @ViewChild('selectPlanModal') public selectPlanModal: ModalDirective;
  constructor() { }

  ngOnInit() {
  }

  public show(): void {
    this.selectPlanModal.show();
  }

  public hideMovingServiceModal(): void {
    this.selectPlanModal.hide();
  }
}
