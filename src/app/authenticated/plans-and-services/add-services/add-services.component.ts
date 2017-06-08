import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'mygexa-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.scss']
})
export class AddServicesComponent implements OnInit {
  date: DateModel;
  options: DatePickerOptions;
  constructor() { }

  ngOnInit() {
     this.options = new DatePickerOptions();
  }

  scrollTop() {
    window.scrollTo(0,0);
  }

}
