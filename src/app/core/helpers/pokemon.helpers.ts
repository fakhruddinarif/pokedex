import { Pokemon } from '@core/models';

/** Format a Pokemon's weight (decimeters stored -> kg). PokeAPI stores weight in hectograms. */
export function formatWeight(p: Pick<Pokemon, 'weight'>): number {
  return p.weight / 10;
}

/** Format height (decimeters -> meters). PokeAPI stores height in decimeters. */
export function formatHeight(p: Pick<Pokemon, 'height'>): number {
  return p.height / 10;
}

/** Capitalize the first letter of a hyphen-separated name, e.g. "mr-mime" -> "Mr-mime". */
export function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Title-case each hyphenated segment: "mega-charizard" -> "Mega Charizard". */
export function titleize(name: string): string {
  return name
    .split('-')
    .map((seg) => capitalize(seg))
    .join(' ');
}

/** Join type names with " / ", each capitalized: ["grass","poison"] -> "Grass / Poison". */
export function joinTypes(types: { name: string }[]): string {
  return types.map((t) => capitalize(t.name)).join(' / ');
}