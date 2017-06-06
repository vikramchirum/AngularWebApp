import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MovingServiceModalDialogComponent } from './moving-service-modal-dialog/moving-service-modal-dialog.component';

@Component({
  selector: 'mygexa-moving-service',
  templateUrl: './moving-service.component.html',
  styleUrls: ['./moving-service.component.scss']
})
export class MovingServiceComponent implements OnInit {



  ngOnInit() {
  }
  
  @ViewChild('movingServiceModal') movingServiceModal: MovingServiceModalDialogComponent;
  constructor(private viewContainerRef: ViewContainerRef) {
  }
  openMovingServiceModal() {
    this.movingServiceModal.show();

  }

}
