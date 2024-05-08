import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import MusicPlayer from '../components/MusicPlayer';

const Main = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MusicPlayer navigation={navigation} />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
