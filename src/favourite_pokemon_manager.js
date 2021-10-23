import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVOURITE_POKEMON_KEY = "favourite_pokemon";

const FavouritePokemonManager = function () {
  const [favouritePokemon, setFavouritePokemon] = useState();

  const getFavouritePokemon = async () => {
    try {
      const value = await AsyncStorage.getItem(`@${FAVOURITE_POKEMON_KEY}`);
      if (value !== null) {
        const json = JSON.parse(value);
        console.log(`Currently favourite pokemon is ${json.name}`);
        setFavouritePokemon(json.name);
        return;
      }
    } catch (e) {
      console.error("Error during loading favourite pokemon", e);
    }
    setFavouritePokemon("");
  };

  const setPokemonAsFavourite = async (pokemonDetails) => {
    try {
      json = JSON.stringify(pokemonDetails);
      await AsyncStorage.setItem(`@${FAVOURITE_POKEMON_KEY}`, json);
      console.log(`Set ${pokemonDetails.name} as favourite`);
      setFavouritePokemon(pokemonDetails);
    } catch (e) {
      console.error("Error during saving favourite pokemon", e);
    }
  };

  const unsetFavouritePokemon = async () => {
    try {
      await AsyncStorage.removeItem(`@${FAVOURITE_POKEMON_KEY}`);
      console.log(`Unsetting favourite pokemon`);
      setFavouritePokemon("");
    } catch (e) {
      console.error("Error during removing favourite pokemon", e);
    }
  };

  return {
    favouritePokemon,
    getFavouritePokemon,
    setPokemonAsFavourite,
    unsetFavouritePokemon,
  };
};

export default FavouritePokemonManager;
