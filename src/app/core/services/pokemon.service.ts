import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import {
  Pokemon,
  PokemonAbility,
  PokemonMove,
  PokemonType,
  RawPokemon,
  TYPE_COLORS,
} from '@core/models';

const BASE_URL = 'https://pokeapi.co/api/v2';
/** Test constraint: only Pokemon #001 to #151 (Kanto region). */
export const FIRST_ID = 1;
export const LAST_ID = 151;

/**
 * Fetches Pokemon data from PokeAPI v2 with in-memory caching and
 * client-side pagination over the constrained range [FIRST_ID, LAST_ID].
 */
@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);

  /** Per-id cached normalized Pokemon. */
  private readonly cache = new Map<number, Observable<Pokemon>>();

  /** Total number of Pokemon the app exposes (151 Kanto). */
  readonly total = LAST_ID - FIRST_ID + 1;

  /** Fetch a single normalized Pokemon by id (1-based) with caching. */
  getPokemon(id: number): Observable<Pokemon> {
    if (id < FIRST_ID || id > LAST_ID) {
      return throwError(() => new Error(`Pokemon id ${id} out of range [${FIRST_ID}, ${LAST_ID}]`));
    }
    const cached = this.cache.get(id);
    if (cached) return cached;

    const req$ = this.http.get<RawPokemon>(`${BASE_URL}/pokemon/${id}`).pipe(
      map((raw) => this.normalize(raw)),
      catchError((err: HttpErrorResponse) =>
        throwError(() => new Error(`Failed to load Pokemon #${id}: ${err.message}`)),
      ),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.cache.set(id, req$);
    return req$;
  }

  /** Fetch a page of normalized Pokemon. `page` is 1-based. */
  getPage(page: number, perPage = 10): Observable<Pokemon[]> {
    const totalPages = this.pageCount(perPage);
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = FIRST_ID + (safePage - 1) * perPage;
    const ids = Array.from({ length: perPage }, (_, i) => start + i).filter(
      (id) => id <= LAST_ID,
    );
    return forkJoin(ids.map((id) => this.getPokemon(id))).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  /** Number of pages for a given page size. */
  pageCount(perPage = 10): number {
    return Math.ceil(this.total / perPage);
  }

  /** Normalizes a raw PokeAPI response into the domain Pokemon model. */
  private normalize(raw: RawPokemon): Pokemon {
    return {
      id: raw.id,
      code: String(raw.id).padStart(3, '0'),
      name: raw.name,
      weight: raw.weight,
      height: raw.height,
      types: raw.types
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map<PokemonType>((t) => ({ name: t.type.name })),
      abilities: raw.abilities
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map<PokemonAbility>((a) => ({
          name: a.ability.name,
          isHidden: a.is_hidden,
          slot: a.slot,
        })),
      moves: raw.moves.map<PokemonMove>((m) => ({ name: m.move.name })),
      image:
        raw.sprites.other?.['official-artwork']?.front_default ??
        raw.sprites.other?.dream_world?.front_default ??
        raw.sprites.front_default ??
        '',
      shinyImage:
        raw.sprites.other?.['official-artwork']?.front_default ??
        raw.sprites.front_shiny ??
        raw.sprites.front_default ??
        '',
    };
  }

  /** Returns the brand color for a Pokemon type name. */
  typeColor(type: string): string {
    return TYPE_COLORS[type] ?? '#A8A77A';
  }
}