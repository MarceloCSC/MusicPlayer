import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer from 'react-native-track-player';
import {db, collection, onSnapshot} from '../../firebase/index';

import PlaylistItem from '../components/PlaylistItem';
import {songs} from '../model/Data';

const Playlists = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onSnapshot(collection(db, 'playlist'), snapshot => {
      setSavedPlaylists(
        snapshot.docs.map(doc => {
          return {...doc.data(), id: doc.id};
        }),
      );
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function handlePlay(id) {
    const playlist = savedPlaylists.find(playlist => playlist.id === id);
    const tracks = songs.filter(song => playlist.tracks.includes(song.id));

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    await TrackPlayer.play();

    navigation.pop();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        {isLoading ? (
          <View style={styles.empty}>
            <ActivityIndicator size="large" color="black" />
            <Text style={styles.text}>Carregando...</Text>
          </View>
        ) : savedPlaylists && savedPlaylists.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.text}>Você não tem playlists salvas.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            <ScrollView>
              {savedPlaylists.map((playlist, index) => {
                return (
                  <PlaylistItem
                    key={index}
                    playlist={playlist}
                    onPlay={handlePlay}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.push('Nova Playlist', {})}>
            <MaterialIcons name="add" size={80} color={'black'} />
            <Text style={styles.buttonText}>Criar nova playlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
  },
  screen: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    width: '100%',
    margin: 10,
    padding: 25,
  },
  text: {color: 'black', fontSize: 18, margin: 20},
  bottom: {
    height: '20%',
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
  },
});
