import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.Production) {
  enableProdMode();
} else {
  console.log('environment', environment);
}

const inlineBundleJs = document.getElementsByTagName('script')[0];
const forteLibraryJs = document.createElement('script');
forteLibraryJs.type = 'text/javascript';
forteLibraryJs.src = `https://${ environment['forteProduction'] === true ? 'api.forte.net' : 'sandbox.forte.net/api' }/js/v1`;
inlineBundleJs.parentNode.insertBefore(forteLibraryJs, inlineBundleJs);

platformBrowserDynamic().bootstrapModule(AppModule);
