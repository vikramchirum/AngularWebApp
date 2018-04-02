import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.Production) {
  enableProdMode();
  window.console.log = function () {
  };
} else {
  console.log('environment', environment);
}

 const head = document.getElementsByTagName('head')[0];
 const forteLibraryJs = document.createElement('script');
 forteLibraryJs.type = 'text/javascript';
 forteLibraryJs.src = environment.forte_api_url;
 head.appendChild(forteLibraryJs);

platformBrowserDynamic().bootstrapModule(AppModule);
