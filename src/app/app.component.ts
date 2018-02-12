import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { debounce, result } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

declare const ga: any;
@Component({
  selector: 'mygexa-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private $content;
  private RouterSubscription: Subscription = null;
  public fixedToBottom = false;
  private intervalCheck = null;

  constructor(
    private Router: Router,
    private ChangeDetectorRef: ChangeDetectorRef
  ) {
    this.Router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      ga('set', 'page', x.url);
      ga('send', 'pageview');
    });
  }

  // Check when the window's size changes.
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.$content) {
      this.determineFooterPosition(event.target);
    }
  }

  ngOnInit() {
    this.$content = document.getElementById('mygexa-content');
    const win = window;
    this.determineFooterPosition = debounce(this.determineFooterPosition, 1);
    // Check when the route changes.
    this.RouterSubscription = this.Router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.determineFooterPosition(win);
      }
    });
    // Check initially.
    this.determineFooterPosition(win);
    // Check ever-so-often.
    this.intervalCheck = setInterval(() => this.determineFooterPosition(win), 1000);
  }

  ngOnDestroy() {
    result(this.RouterSubscription, 'unsubscribe');
    clearInterval(this.intervalCheck);
  }

  determineFooterPosition(target): void {
    this.fixedToBottom = target.innerHeight > (this.$content.clientHeight + 66);
    this.ChangeDetectorRef.detectChanges();
  }

}
