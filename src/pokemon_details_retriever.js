import { useState, useEffect } from "react";

const PokemonDetailsRetriever = function (url) {
  const [pokemonDetails, setPokemonDetails] = useState();

  useEffect(() => {
    const getPokemonDetails = async () => {
      const response = await fetch(url);
      const json = await response.json();
      console.log("Received details about " + json.name);
      setPokemonDetails(json);
    };
    getPokemonDetails();
  }, [url]);

  return pokemonDetails;
};

export default PokemonDetailsRetriever;
