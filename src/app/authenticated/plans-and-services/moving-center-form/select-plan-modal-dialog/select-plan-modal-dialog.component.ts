import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
  selector: 'mygexa-select-plan-modal-dialog',
  templateUrl: './select-plan-modal-dialog.component.html',
  styleUrls: ['./select-plan-modal-dialog.component.scss']

})
export class SelectPlanModalDialogComponent implements OnInit {

  @Input() newPlans;
  @ViewChild('selectPlanModal') public selectPlanModal: ModalDirective;
  @Output() selectedPlan: EventEmitter<any> =  new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
   
  }

  public show(): void {
    this.selectPlanModal.show();
  }

  public hideMovingServiceModal(): void {
    this.selectPlanModal.hide();
  }

  selectPlan(offers) {
   this.selectedPlan.emit(offers);
   this.selectPlanModal.hide();
  }
}
