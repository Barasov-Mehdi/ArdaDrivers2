import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Members from './src/screens/Members';
import Home from './src/screens/Home';
import OrderDetails from './src/screens/OrderDetails';
import LastOrder from './src/screens/LastOrder';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // App bar'ı gizler
        }}
      >
        <Stack.Screen name='Members' component={Members} />
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="LastOrder" component={LastOrder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
