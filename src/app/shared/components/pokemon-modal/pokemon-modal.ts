import { Component, computed, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { Pokemon } from '@core/models';
import { PokemonService } from '@core/services';
import {
  formatHeight,
  formatWeight,
  joinTypes,
  titleize,
} from '@core/helpers';
import { TypeBadge } from '../type-badge/type-badge';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe, TypeBadge],
  templateUrl: './pokemon-modal.html',
})
export class PokemonModal {
  readonly pokemon = input<Pokemon | null>(null);

  readonly isOpen = computed(() => this.pokemon() !== null);
  readonly accent = computed(() => {
    const p = this.pokemon();
    if (!p) return '#FFC349';
    return this.poke.typeColor(p.types[0]?.name ?? 'normal');
  });
  readonly styleVars = computed(() => {
    const c = this.accent();
    return {
      '--accent': c,
      '--accent-soft': `color-mix(in srgb, ${c} 35%, transparent)`,
      '--card-glow': `color-mix(in srgb, ${c} 45%, transparent)`,
    } as Record<string, string>;
  });

  constructor(
    private readonly poke: PokemonService,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  get name(): string { return this.pokemon() ? titleize(this.pokemon()!.name) : ''; }
  get weightKg(): number { return this.pokemon() ? formatWeight(this.pokemon()!) : 0; }
  get heightM(): number { return this.pokemon() ? formatHeight(this.pokemon()!) : 0; }
  get typeLabel(): string { return this.pokemon() ? joinTypes(this.pokemon()!.types) : ''; }
  get moves(): string[] {
    const p = this.pokemon();
    return p ? p.moves.map((m) => titleize(m.name)).sort((a, b) => a.localeCompare(b)) : [];
  }
  get abilities(): { label: string; hidden: boolean }[] {
    const p = this.pokemon();
    return p ? p.abilities.map((a) => ({ label: titleize(a.name), hidden: a.isHidden })) : [];
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  close(): void {
    this.host.nativeElement.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }));
  }
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
  onImageError(ev: Event): void {
    (ev.target as HTMLImageElement).src = 'assets/images/pokemon-ball.png';
  }
  trackAbility(_: number, a: { label: string }): string { return a.label; }
}