import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideTranslateService,
  provideMissingTranslationHandler,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

/** Returns the translation key as-is when a translation is missing (dev safety net). */
export class MissingKeyHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    return params.key;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ...provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      missingTranslationHandler: provideMissingTranslationHandler(MissingKeyHandler),
    }),
    ...provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
      enforceLoading: false,
      useHttpBackend: false,
    }),
  ],
};