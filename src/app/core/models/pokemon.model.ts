/** Domain models — normalized shapes used across the app. */

export interface PokemonType {
  name: string;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  slot: number;
}

export interface PokemonMove {
  name: string;
}

export interface Pokemon {
  id: number;
  /** Zero-padded 3-digit display id, e.g. "001". */
  code: string;
  name: string;
  weight: number;
  height: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  image: string;
  shinyImage: string;
}

/** Maps a pokemon type to a representative hex color (PokeAPI convention). */
export const TYPE_COLORS: Readonly<Record<string, string>> = {
  fire: '#FF8C42',
  grass: '#7AC74C',
  electric: '#F7D02C',
  water: '#6390F0',
  ground: '#E2BF65',
  rock: '#B6A136',
  fairy: '#D685AD',
  poison: '#A33EA1',
  bug: '#A6B91A',
  dragon: '#6F35FC',
  psychic: '#F95587',
  flying: '#A98FF3',
  fighting: '#C22E28',
  normal: '#A8A77A',
  ice: '#96D9D6',
  ghost: '#735797',
  dark: '#705746',
  steel: '#B7B7CE',
};