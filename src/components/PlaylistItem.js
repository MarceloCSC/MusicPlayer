import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PlaylistItem = ({playlist, onPlay}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{playlist.name}</Text>
      <View style={styles.rowEnd}>
        <Text style={styles.smallText}>
          {playlist.tracks.length + ' músicas'}
        </Text>
        <TouchableOpacity onPress={() => onPlay(playlist.id)}>
          <MaterialCommunityIcons name="play" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaylistItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 45,
  },
  text: {color: 'black', fontSize: 18, fontWeight: 400},
  smallText: {color: '#5A5A5A', fontSize: 14},
});
