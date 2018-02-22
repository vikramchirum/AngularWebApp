import { Component, OnInit, EventEmitter, Input, Output, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';



import { AddressSearchService } from 'app/core/addresssearch.service';
import { ISearchAddressRequest } from 'app/core/models/serviceaddress/searchaddressrequest.model';
import { ServiceAddress } from 'app/core/models/serviceaddress/serviceaddress.model';


@Component({
  selector: 'mygexa-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.scss']
})
export class AddressSearchComponent implements OnInit {

  public selectedAddress: string = '';
  newAddressList: Observable<ServiceAddress[]>;
  private searchTerms = new Subject<string>();
  showAddressList: boolean = true;
  isValidAddress: boolean = null;

  @Input() public IsDisabled = false;

  @Output() public onSelectedServiceAddress = new EventEmitter();
  @Output() public onServiceAddressChanged = new EventEmitter();

  constructor(
    private  addressSearchService: AddressSearchService,
    private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.showAddressList = true;
    this.searchTerms.next(term);
    if ( !term ) {
      this.isValidAddress = false;
    } else {
      this.isValidAddress = true;
    }
    this.onServiceAddressChanged.emit(this.isValidAddress);
  }

  ngOnInit(): void {
    this.newAddressList = this.searchTerms
      .debounceTime(100)        // wait 100ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.searchNewAddress(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<ServiceAddress[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<ServiceAddress[]>([]);
      });
  }


  searchNewAddress(queryString: string) {
    const searchRequest = {} as ISearchAddressRequest;
    searchRequest.partial = queryString;
    return this.addressSearchService.searchAddress(searchRequest);
  }

   selectNewServiceAddress(value, event) {
    event.stopPropagation();
    this.selectedAddress = value.newAddressString();
    console.log('New service address', value);
    this.onSelectedServiceAddress.emit(value);
    this.showAddressList = !this.showAddressList;

  }
}
