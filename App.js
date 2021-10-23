import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PokemonListStack from "./src/pokemon_list_stack"
import FavouritePokemonScreen from "./src/favourite_pokemon_screen";
import PokemonWorldMapScreen from "./src/pokemon_world_map_screen";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Pokemons" component={PokemonListStack} />
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
