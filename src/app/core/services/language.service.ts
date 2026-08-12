import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'id';

const SUPPORTED: Lang[] = ['en', 'id'];
const STORAGE_KEY = 'pokedex-lang';

/**
 * Thin wrapper around TranslateService for app-level language lifecycle:
 * read user preference → detect browser language → persist on switch.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /** Languages offered by the app. */
  readonly available = SUPPORTED;

  /** Initialize language preference. Call once on app bootstrap. */
  init(): void {
    const lang = this.resolve();
    this.translate.use(lang);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, lang);
  }

  /** Switch the active language and persist. */
  use(lang: Lang): void {
    this.translate.use(lang);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, lang);
  }

  /** Currently active language code. */
  get current(): Lang {
    const c = this.translate.getCurrentLang() as Lang | null;
    return c && SUPPORTED.includes(c) ? c : 'en';
  }

  private resolve(): Lang {
    const stored = this.isBrowser ? (localStorage.getItem(STORAGE_KEY) as Lang | null) : null;
    if (stored && SUPPORTED.includes(stored)) return stored;
    if (this.isBrowser) {
      const nav = navigator.language?.slice(0, 2)?.toLowerCase();
      if (nav === 'id') return 'id';
    }
    return 'en';
  }
}