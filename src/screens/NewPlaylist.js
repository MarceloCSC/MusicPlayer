import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Input} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db, collection, addDoc} from '../../firebase/index';

import SongItem from '../components/SongItem';
import {songs} from '../model/Data';

const NewPlaylist = ({navigation}) => {
  const [name, setName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  function handleChangeText(text) {
    setName(text);
  }

  function handleSelect(trackId) {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks([...selectedTracks.filter(item => item !== trackId)]);
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const docRef = await addDoc(collection(db, 'playlist'), {
        name: name,
        tracks: selectedTracks,
      });
      console.log('Documento salvo com ID: ', docRef.id);
      navigation.pop();
    } catch (error) {
      console.error('Erro ao adicionar documento: ', error);
      setIsSaving(false);
    }
  }

  if (isSaving) {
    return (
      <View style={styles.container}>
        <View style={styles.empty}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.text}>Salvando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.body}>
        <View style={styles.input}>
          <Input
            placeholder="Nome da playlist"
            containerStyle={{marginTop: 20}}
            onChangeText={handleChangeText}
            maxLength={30}
          />
        </View>

        <View style={styles.list}>
          <ScrollView>
            {songs &&
              songs.map((song, index) => {
                return (
                  <SongItem key={index} song={song} onSelect={handleSelect} />
                );
              })}
          </ScrollView>
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#954535'}]}
            onPress={() => navigation.pop()}>
            <MaterialCommunityIcons
              name="close-thick"
              size={40}
              color={'#FAF9F6'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#478778'}]}
            onPress={handleSave}
            disabled={
              !name || name.trim().length === 0 || selectedTracks.length === 0
            }>
            <MaterialCommunityIcons
              name="check-bold"
              size={40}
              color={'#FAF9F6'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NewPlaylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  input: {padding: 10, height: '15%'},
  body: {flex: 1, width: '100%'},
  empty: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {color: 'black', fontSize: 22},
  list: {flex: 1, margin: 10},
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '12%',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '45%',
  },
});
