import React from "react";
import { FlatList, TouchableOpacity, Text } from "react-native";
import PokemonListRetriever from "./pokemon_list_retrieval";
import styles from "./styles";

function PokemonListView({ navigation }) {
  const { pokemonList, loadMorePokemons } = PokemonListRetriever();

  const PokemonItem = ({ pokemon }) => (
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed " + pokemon.name);
        navigation.navigate("Pokemon's details", pokemon);
      }}
      style={styles.item}
    >
      <Text style={styles.title}>{pokemon.name}</Text>
    </TouchableOpacity>
  );

  const renderPokemonItem = ({ item }) => <PokemonItem pokemon={item} />;
  const onEndReached = () => {
    console.log("Approaching end of the list, requesting for more pokemons");
    loadMorePokemons();
  };
  return (
    <FlatList
      data={pokemonList}
      renderItem={renderPokemonItem}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      keyExtractor={(item) => item.name}
    />
  );
}

export default PokemonListView;
