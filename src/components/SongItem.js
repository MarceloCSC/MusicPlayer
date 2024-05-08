import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const SongItem = ({song, onSelect}) => {
  const [isChecked, setIsChecked] = useState(false);

  function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  function handleValueChange() {
    setIsChecked(!isChecked);
    onSelect(song.id);
  }

  return (
    <View style={styles.row}>
      <View style={styles.song}>
        <CheckBox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={handleValueChange}
        />
        <View>
          <Text style={styles.text}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.text}>{formatDuration(song.duration)}</Text>
      </View>
    </View>
  );
};

export default SongItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  song: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {marginRight: 8},
  text: {color: 'black', fontSize: 18},
  artist: {color: '#5A5A5A', fontSize: 14},
});
