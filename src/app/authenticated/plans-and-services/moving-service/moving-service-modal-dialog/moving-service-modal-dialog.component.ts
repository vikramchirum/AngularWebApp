import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'mygexa-moving-service-modal-dialog',
  templateUrl: './moving-service-modal-dialog.component.html',
  styleUrls: ['./moving-service-modal-dialog.component.scss']
})
export class MovingServiceModalDialogComponent implements OnInit {
  date: DateModel;
  options: DatePickerOptions;
  @ViewChild('movingServiceModal') public movingServiceModal: ModalDirective;
  constructor() {
    this.options = new DatePickerOptions();
  }

  ngOnInit() {
  }
  public show(): void {
    this.movingServiceModal.show();
  }

  public hideMovingServiceModal():void {
    this.movingServiceModal.hide();
  }
   scrollTop() {
    window.scrollTo(0,0);
  }

}
