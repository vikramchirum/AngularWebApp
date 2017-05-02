import { browser, element, by } from 'protractor';

export class MygexaPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('mygexa-root h1')).getText();
  }
}
