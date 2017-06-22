import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'mygexa-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit {

  securityQuestionForm: FormGroup;
  editing: boolean;
  submitAttempt: boolean;

  constructor(fb: FormBuilder) {
    this.editing = false;
    this.securityQuestionForm = fb.group({
      'question1': [null, Validators.required],
      'question2': [null, Validators.required]
    }, { /* Validate security questions here. */ });
  }

  ngOnInit() { }

  toggleEdit($event) {
    $event.preventDefault();
    this.editing = !this.editing;
  }

}
