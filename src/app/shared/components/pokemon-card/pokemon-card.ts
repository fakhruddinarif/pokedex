import { Component, computed, input, output } from '@angular/core';
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

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './pokemon-card.html',
})
export class PokemonCard {
  readonly pokemon = input.required<Pokemon>();
  readonly index = input<number>(0);
  readonly cardClick = output<Pokemon>();

  readonly primaryType = computed(() => this.pokemon().types[0]?.name ?? 'normal');
  readonly accent = computed(() => this.poke.typeColor(this.primaryType()));
  readonly styleVars = computed(() => {
    const c = this.accent();
    return {
      '--accent': c,
      '--accent-soft': `color-mix(in srgb, ${c} 35%, transparent)`,
      '--card-border': `color-mix(in srgb, ${c} 70%, var(--border))`,
      '--card-glow': `color-mix(in srgb, ${c} 45%, transparent)`,
    } as Record<string, string>;
  });

  constructor(private readonly poke: PokemonService) {}

  get name(): string { return titleize(this.pokemon().name); }
  get weightKg(): number { return formatWeight(this.pokemon()); }
  get heightM(): number { return formatHeight(this.pokemon()); }
  get typeLabel(): string { return joinTypes(this.pokemon().types); }
  get enterDelay(): number { return Math.min(this.index() * 50, 350); }

  onActivate(): void { this.cardClick.emit(this.pokemon()); }
  onImageError(ev: Event): void {
    (ev.target as HTMLImageElement).src = 'assets/images/pokemon-ball.png';
  }
}