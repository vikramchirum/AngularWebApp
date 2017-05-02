import { MygexaPage } from './app.po';

describe('mygexa App', () => {
  let page: MygexaPage;

  beforeEach(() => {
    page = new MygexaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('mygexa works!');
  });
});
