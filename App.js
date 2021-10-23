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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

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

const PokemonListStack = createNativeStackNavigator();

function PokemonListScreen() {
  return (
    <PokemonListStack.Navigator>
      <PokemonListStack.Screen name="Pokemon's list" component={PokemonList} />
      <PokemonListStack.Screen
        name="Pokemon's details"
        component={PokemonDetailsView}
      />
    </PokemonListStack.Navigator>
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

function FavouritePokemonScreen() {
  const { favouritePokemon, getFavouritePokemon } = FavouritePokemonManager();

  useEffect(() => {
    getFavouritePokemon();
  }, [favouritePokemon]);

  console.log(favouritePokemon);

  if (favouritePokemon === undefined) {
    return (
      <View>
        <Text style={styles.title}>Favourite pokemon is not yet set</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{favouritePokemon}</Text>
    </View>
  );
}

function PokemonWorldMapScreen() {
  const [markers, setMarkers] = useState([]);
  const AddMarker = (LatLng) => {
    console.log("Adding new marker on " + LatLng.longitude + " " + LatLng.latitude);
    const createNewMarker = () => {
      return {
        latlng: LatLng,
        title: "Marker",
        description: "Test"
      };
    };
    setMarkers([...markers, new createNewMarker()]);
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 50.06176654886843,
        longitude: 19.937563419638618,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
      onLongPress={(e) => {
        AddMarker(e.nativeEvent.coordinate);
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Pokemons" component={PokemonListScreen} />
        <Tab.Screen
          name="Favourite Pokemon"
          component={FavouritePokemonScreen}
        />
        <Tab.Screen
          name="Pokemon's world map"
          component={PokemonWorldMapScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
