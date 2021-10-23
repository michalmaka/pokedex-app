import React from "react";
import { useState } from "react";
import MapView, {Marker} from "react-native-maps";

function PokemonWorldMapScreen() {
  const [markers, setMarkers] = useState([]);
  const AddMarker = (LatLng) => {
    console.log(
      "Adding new marker on " + LatLng.longitude + " " + LatLng.latitude
    );
    const createNewMarker = () => {
      return {
        latlng: LatLng,
        title: "Marker",
        description: "Test",
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

export default PokemonWorldMapScreen
