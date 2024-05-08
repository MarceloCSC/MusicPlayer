import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './src/screens/Main';
import Playlists from './src/screens/Playlists';
import NewPlaylist from './src/screens/NewPlaylist';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            options={{headerShown: false}}
            component={Main}
          />
          <Stack.Screen name="Playlists Salvas" component={Playlists} />
          <Stack.Screen name="Nova Playlist" component={NewPlaylist} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
