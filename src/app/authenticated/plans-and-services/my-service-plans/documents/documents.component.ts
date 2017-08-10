import { Component, Input } from '@angular/core';

import { ServiceAccount } from 'app/core/models/serviceaccount/serviceaccount.model';

@Component({
  selector: 'mygexa-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {

  @Input() ActiveServiceAccount: ServiceAccount = null;

  constructor() { }
}
