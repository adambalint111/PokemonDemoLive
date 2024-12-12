"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Pokemon {
  name: string;
  url: string;
  image: string;
  types: string[];
  generation: number;
}

export default function PokemonSearch() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 12;

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    const filtered = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPokemons(filtered);
    setCurrentPage(1);
  }, [search, pokemons]);

  const fetchPokemons = async () => {
    try {
      const response = await fetch("/api/pokemon");
      const data = await response.json();
      setPokemons(data.pokemonDetails);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
    }
  };

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pokémon Search</h1>
      <Input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPokemons.map((pokemon) => (
          <Card key={pokemon.name}>
            <CardHeader>
              <CardTitle>{pokemon.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-32 h-32 mx-auto"
              />
              <p>Types: {pokemon.types.join(", ")}</p>
              <p>Generation: {pokemon.generation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from(
            { length: Math.ceil(filteredPokemons.length / pokemonsPerPage) },
            (_, i) => {
              if (
                i === 0 ||
                i ===
                  Math.ceil(filteredPokemons.length / pokemonsPerPage) - 1 ||
                (i >= currentPage - 2 && i <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => paginate(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (i === currentPage - 3 || i === currentPage + 3) {
                return <PaginationEllipsis key={i} />;
              }
              return null;
            }
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredPokemons.length / pokemonsPerPage)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
