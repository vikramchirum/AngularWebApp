import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'mygexa-paperless-settings',
  templateUrl: './paperless-settings.component.html',
  styleUrls: ['./paperless-settings.component.scss']
})
export class PaperlessSettingsComponent implements OnInit {

paperlessEditing: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  togglePaperlessEdit($event) {
    $event.preventDefault();
    this.paperlessEditing = !this.paperlessEditing;
  }


}
