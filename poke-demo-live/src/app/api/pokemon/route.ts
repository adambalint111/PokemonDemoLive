import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0"
  );
  const data = await response.json();
  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const response = await fetch(pokemon.url);
      const details = await response.json();
      return {
        name: pokemon.name,
        url: pokemon.url,
        image: details.sprites.front_default,
        types: details.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        generation: getGeneration(details.id),
      };
    })
  );

  // Return the data
  return NextResponse.json({ pokemonDetails });
}

const getGeneration = (id: number) => {
  if (id <= 151) {
    return 1;
  }
  if (id <= 251) {
    return 2;
  }
  if (id <= 386) {
    return 3;
  }
  if (id <= 493) {
    return 4;
  }
  if (id <= 649) {
    return 5;
  }
  if (id <= 721) {
    return 6;
  }
  if (id <= 809) {
    return 7;
  }
  return 8;
};
