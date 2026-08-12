import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pokemon } from '@core/models';
import { PokemonService } from '@core/services';
import { capitalize, joinTypes } from '@core/helpers';

/** Small pill showing a Pokemon type name in its native color. */
@Component({
  selector: 'app-type-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="badge"
      [style.--tc]="accent()"
      [style.background-color]="'color-mix(in srgb, ' + accent() + ' 18%, transparent)'"
      [style.color]="accent()"
    >
      {{ label() }}
    </span>
  `,
  styles: [
    `
      :host { display: inline-flex; }
      .badge {
        display: inline-block;
        padding: 0.12rem 0.55rem;
        border-radius: var(--radius-pill);
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: capitalize;
        line-height: 1.4;
        white-space: nowrap;
      }
    `,
  ],
})
export class TypeBadge {
  readonly type = input<string>('normal');
  readonly accent = computed(() => this.poke.typeColor(this.type()));
  readonly label = computed(() => capitalize(this.type()));
  constructor(private readonly poke: PokemonService) {}
}

/** Static helper — not a component; collapsed here for reuse in templates if needed. */
export function typesOf(p: Pokemon): string {
  return joinTypes(p.types);
}