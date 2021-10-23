import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
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
    console.log("Reached the end");
    pokemonListRetriever.get_next_pokemons();
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

function PokemonDetailsView({ navigation, route }) {
  const pokemon = route.params;
  const pokemonDetails = PokemonDetailsRetriever(pokemon.url);

  if (pokemonDetails === undefined) {
    return (
      <View>
        <Text>Loading details about pokemon {pokemon.name}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Something about pokemon {pokemon.name}</Text>
      <Image
        style={styles.logo}
        source={{ uri: pokemonDetails.sprites.front_default }}
      />
    </View>
  );
}

function PokemonListHome() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Pokemon's list" component={PokemonList} />
        <Stack.Screen name="Pokemon's details" component={PokemonDetailsView} />
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
  logo: {
    width: 150,
    height: 150,
  },
});

export default PokemonListHome;
