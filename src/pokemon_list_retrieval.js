import React, { useEffect, useState } from "react";

const POKE_API_URI = "http://192.168.0.197:5000";

const PokemonListRetriever = function () {
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const getPokemonList = async () => {
      const response = await fetch(
        POKE_API_URI + `/pokemon?offset=${offset}&limit=${limit}`
      );
      const json = await response.json();
      const newly_loaded_pokemons = json.results.map((field) => {
        return field;
      });
      console.log(`Received new ${newly_loaded_pokemons.length} pokemons`);
      setPokemonList([...pokemonList, ...newly_loaded_pokemons]);
      setHasMoreData(offset + newly_loaded_pokemons.length < json.count);
    };

    if (hasMoreData) {
      getPokemonList();
    }
  }, [offset]);

  const loadMorePokemons = () => {
    setOffset(offset + limit);
  };

  return { pokemonList, loadMorePokemons };
};

export default PokemonListRetriever;
