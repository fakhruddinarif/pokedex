/** Raw PokeAPI v2 shape — only the fields consume. */

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonAbilitySlot {
  is_hidden: boolean;
  slot: number;
  ability: NamedApiResource;
}

export interface PokemonMoveSlot {
  move: NamedApiResource;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    dream_world?: { front_default: string | null };
    'official-artwork'?: { front_default: string | null };
  };
}

export interface RawPokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: PokemonTypeSlot[];
  abilities: PokemonAbilitySlot[];
  moves: PokemonMoveSlot[];
  sprites: PokemonSprites;
  species: NamedApiResource;
}