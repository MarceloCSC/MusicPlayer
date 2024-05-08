import React, {useCallback} from 'react';
import {SafeAreaView, Text, Pressable, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import * as ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ImagePickerModal({isVisible, onClose, onSelectImage}) {
  handleSelectImage = pickerResponse => {
    const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;
    onSelectImage(uri);
  };

  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, handleSelectImage);
  }, []);

  const onCameraPress = useCallback(() => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchCamera(options, handleSelectImage);
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={styles.modal}>
      <SafeAreaView style={styles.buttons}>
        <Pressable style={styles.button} onPress={onImageLibraryPress}>
          <MaterialIcons
            name="photo-library"
            size={30}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Biblioteca</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onCameraPress}>
          <MaterialCommunityIcons
            name="camera-plus"
            size={30}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Camera</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  buttonIcon: {
    margin: 5,
  },
  buttons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
