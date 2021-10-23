import React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";

import FavouritePokemonManager from "./favourite_pokemon_manager";
import styles from "./styles";

function FavouritePokemonScreen() {
  const { favouritePokemon, getFavouritePokemon } = FavouritePokemonManager();

  useEffect(() => {
    getFavouritePokemon();
  }, [favouritePokemon]);

  console.log(favouritePokemon);

  if (favouritePokemon === undefined) {
    return (
      <View>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  } else if (favouritePokemon === "") {
    return (
      <View>
        <Text style={styles.title}>Favourite pokemon is not yet set</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}> {favouritePokemon}</Text>
    </View>
  );
}

export default FavouritePokemonScreen;
