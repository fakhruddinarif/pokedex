import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

import { Pokemon } from '@core/models';
import { PokemonService } from '@core/services';
import { PokemonCard, Pagination, PokemonModal } from '@shared/components';

const PER_PAGE = 10;

@Component({
  selector: 'app-page-pokemon',
  standalone: true,
  imports: [CommonModule, TranslatePipe, PokemonCard, Pagination, PokemonModal],
  templateUrl: './pokemon.html',
})
export class PokemonPage implements OnInit, OnDestroy {
  private readonly poke = inject(PokemonService);

  readonly items = signal<Pokemon[]>([]);
  readonly page = signal(1);
  readonly totalPages = this.poke.pageCount(PER_PAGE);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selected = signal<Pokemon | null>(null);
  readonly perPage = PER_PAGE;

  private readonly sub = new Subscription();

  ngOnInit(): void { this.loadPage(this.page()); }
  ngOnDestroy(): void { this.sub.unsubscribe(); }

  loadPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);
    const sub = this.poke.getPage(page, PER_PAGE).subscribe({
      next: (list) => { this.items.set(list); this.loading.set(false); },
      error: (err: Error) => { this.error.set(err.message); this.loading.set(false); },
    });
    this.sub.add(sub);
  }

  onPageChange(next: number): void {
    if (next === this.page()) return;
    this.page.set(next);
    this.loadPage(next);
  }
  onCardClick(p: Pokemon): void { this.selected.set(p); }
  closeModal(): void { this.selected.set(null); }
  retry(): void { this.loadPage(this.page()); }
  trackPokemon(_: number, p: Pokemon): number { return p.id; }
}