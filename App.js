import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Button,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

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

function PokemonList({ navigation }) {
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
    console.log("Reached the end");
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
  const [buttonTitle, setButtonTitle] = useState("Add to favourites");
  const [buttonColor, setButtonColor] = useState("blue");

  useEffect(() => {
    navigation.setOptions({ title: pokemon.name });
  });

  if (pokemonDetails === undefined) {
    return (
      <View>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Button
        title={buttonTitle}
        color={buttonColor}
        onPress={() => {
          console.log(`Added ${pokemonDetails.name} to favourites`);
          setButtonTitle("This pokemon is your favourite!");
          setButtonColor("red")
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
