import { Directive, HostListener, OnInit , Output, EventEmitter} from '@angular/core';
import { NgControl } from '@angular/forms';
import { PhonePipe } from '../pipes/phone.pipe';

// @Directive({
//   selector: '[ngModel][phone]',
//   host: {
//     '(ngModelChange)': 'onInputChange($event)',
//     '(blur)': 'onBlur($event)'
//   }
// })

@Directive({
  selector: '[mygexaPhone]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(blur)': 'onBlur($event)'
  },
  providers: [ PhonePipe]
})
export class PhoneDirective implements OnInit {
  constructor (
    private phonePipe: PhonePipe,
    private control: NgControl) {
    this.control = control;
  }

  @Output() rawChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit () {
    let formatted = this.phonePipe.transform(this.control['model']);
    setTimeout(() => this.control.valueAccessor.writeValue(formatted), 0);
  }

  onBlur () {
    // let val =  this.control['model'];
    // let raw = val.replace(/\W/g, '');
    // let formatted = this.phonePipe.transform(raw);
    // this.control.valueAccessor.writeValue(formatted);
    // this.control.viewToModelUpdate(raw);
  }

  onInputChange (val) {
    let raw = val.replace(/\W/g, '');
    let formatted = this.phonePipe.transform(raw);
     this.control.valueAccessor.writeValue(formatted);
    // this.control.viewToModelUpdate(raw);
    this.rawChange.emit(formatted);
  }

}
