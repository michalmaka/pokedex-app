import React, { useEffect } from "react";
import { View, Text, ScrollView, Button, Image } from "react-native";

import PokemonDetailsRetriever from "./pokemon_details_retriever";
import FavouritePokemonManager from "./favourite_pokemon_manager";
import styles from "./styles";

function PokemonDetailsView({ navigation, route }) {
  const pokemon = route.params;
  const pokemonDetails = PokemonDetailsRetriever(pokemon.url);
  const FAVOURITE_COLOR = "red";
  const NOT_FAVOURITE_COLOR = "blue";
  const TITLE_ON_FAVOURITE = "Unset as favourite";
  const TITLE_ON_NOT_FAVOURITE = "Add to favourite";
  const {
    favouritePokemon,
    getFavouritePokemon,
    setPokemonAsFavourite,
    unsetFavouritePokemon,
  } = FavouritePokemonManager();

  useEffect(() => {
    navigation.setOptions({ title: pokemon.name });
    getFavouritePokemon();
  }, [favouritePokemon]);

  if (pokemonDetails === undefined || favouritePokemon === undefined) {
    return (
      <View>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  const isFavourite = favouritePokemon === pokemonDetails.name;

  return (
    <ScrollView>
      <Button
        title={isFavourite ? TITLE_ON_FAVOURITE : TITLE_ON_NOT_FAVOURITE}
        color={isFavourite ? FAVOURITE_COLOR : NOT_FAVOURITE_COLOR}
        onPress={() => {
          if (isFavourite) {
            console.log(`Unsetting ${pokemonDetails.name} as favourite`);
            unsetFavouritePokemon();
          } else {
            console.log(`Adding ${pokemonDetails.name} as favourite`);
            setPokemonAsFavourite(pokemonDetails);
          }
        }}
      />
      <Image
        style={styles.logo}
        source={{ uri: pokemonDetails.sprites.front_default }}
      />
      <Text style={styles.title}>Height</Text>
      <Text>{pokemonDetails.height}</Text>
      <Text style={styles.title}>Weight</Text>
      <Text>{pokemonDetails.weight}</Text>
      <Text style={styles.title}>Abilities</Text>
      {pokemonDetails.abilities.map((abilityInfo) => {
        return (
          <Text key={abilityInfo.ability.name}>{abilityInfo.ability.name}</Text>
        );
      })}
      <Text style={styles.title}>Moves</Text>
      {pokemonDetails.moves.map((moveInfo) => {
        return <Text key={moveInfo.move.name}>{moveInfo.move.name}</Text>;
      })}
    </ScrollView>
  );
}

export default PokemonDetailsView;
