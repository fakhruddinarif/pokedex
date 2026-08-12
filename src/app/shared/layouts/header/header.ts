import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ThemeService } from '@core/services/theme.service';
import { LanguageService, Lang } from '@core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.html',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly language = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly theme = this.themeService.theme;
  readonly isFullscreen = signal(false);
  readonly availableLangs = this.language.available;

  readonly currentLang = signal<Lang>(this.language.current);

  constructor() {
    this.translate.onLangChange.subscribe((e) => this.currentLang.set(e.lang as Lang));
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    const next: Lang = this.currentLang() === 'en' ? 'id' : 'en';
    this.language.use(next);
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen.set(Boolean(document.fullscreenElement));
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }
}