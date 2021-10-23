import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PokemonListView from "./pokemon_list_view";
import PokemonDetailsView from "./pokemon_details_view";

const PokemonListStackBase = createNativeStackNavigator();

function PokemonListStack() {
  return (
    <PokemonListStackBase.Navigator>
      <PokemonListStackBase.Screen
        name="Pokemon's list"
        component={PokemonListView}
      />
      <PokemonListStackBase.Screen
        name="Pokemon's details"
        component={PokemonDetailsView}
      />
    </PokemonListStackBase.Navigator>
  );
}

export default PokemonListStack;
