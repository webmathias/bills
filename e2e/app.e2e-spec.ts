import { Teste1Page } from './app.po';

describe('teste1 App', function() {
  let page: Teste1Page;

  beforeEach(() => {
    page = new Teste1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
