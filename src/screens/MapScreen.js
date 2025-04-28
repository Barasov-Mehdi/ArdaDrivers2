// MapScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const MapScreen = ({ route }) => {
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri }} style={styles.mapContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
});

export default MapScreen;