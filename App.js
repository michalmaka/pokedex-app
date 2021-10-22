import React, { useState } from "react";
import { StatusBar, StyleSheet, FlatList, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const POKE_API_URI = "http://192.168.0.197:5000";

const PokemonListRetriever = () => {
  retriever = {
    offset: 0,
    limit: 20,
    number_of_pokemons: 0,
    on_received_pokemons: undefined,
    get_pokemons: function () {
      console.info("get_pokemons");
      fetch(POKE_API_URI + `/pokemon?offset=${this.offset}&limit=${this.limit}`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.number_of_pokemons = json.count;
          if (this.on_received_pokemons !== undefined) {
            this.on_received_pokemons(json);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    get_next_pokemons: function () {
      if (this.offset + this.limit < this.number_of_pokemons) {
        this.offset += this.limit;
        this.get_pokemons();
      } else {
        alert("No more pokemons to load");
      }
    },
  };

  retriever.get_pokemons();

  return retriever;
};

const pokemonListRetriever = new PokemonListRetriever();

function PokemonList({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);

  pokemonListRetriever.on_received_pokemons = (pokemons_json) => {
    const newly_loaded_pokemons = pokemons_json.results.map((field) => {
      return field;
    });
    setPokemonList([...pokemonList, ...newly_loaded_pokemons]);
  };

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => <Item title={item.name} />;
  const onEndReached = () => {
    console.log("Reached the end");
    pokemonListRetriever.get_next_pokemons();
  };
  return (
    <FlatList
      data={pokemonList}
      renderItem={renderItem}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      keyExtractor={(item) => item.name}
    />
  );
}

function PokemonListHome() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Pokemon's list" component={PokemonList} />
        {/* <Stack.Screen name="Pokemon's details" component={DetailsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default PokemonListHome;
