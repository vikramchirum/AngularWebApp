import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mygexa-view-my-bill-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  @Input() preference: string;

  active: boolean;
  preference_text: string;

  constructor() {
    // Make 'null' to tell the view we're loading:
    this.active = true;
  }

  ngOnInit() {
    // Get the preference from the Billing_Account API:
    // Using localStorage for temporary data:
    this.active = localStorage.getItem(`mygexa_view_bill_preference_${this.preference}`) === 'true';
    switch (this.preference) {
      case 'auto-pay': {
        this.preference_text = 'Automatic Payments';
        break;
      }
      case 'budget-billing': {
        this.preference_text = 'Budget Billing';
        break;
      }
      case 'ebill-paperless': {
        this.preference_text = 'eBill (Paperless)';
        break;
      }
    }
  }

  togglePreference() {
    // Send update to the Billing_Account API:
    this.active = !this.active;
    // Using localStorage for temporary data:
    localStorage.setItem(`mygexa_view_bill_preference_${this.preference}`, this.active ? 'true' : 'false');
  }
}
