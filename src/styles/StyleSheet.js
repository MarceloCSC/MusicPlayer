import {StyleSheet} from 'react-native';

const makeStyles = (colors, screenWidth) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bodyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomContainer: {
      alignItems: 'center',
      width: screenWidth,
      paddingVertical: 15,
      borderTopColor: colors.border,
      borderWidth: 1,
    },
    iconsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: screenWidth,
    },
    imageWrapper: {
      width: 300,
      height: 340,
      marginBottom: 20,
      marginTop: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    editImageBtn: {
      position: 'absolute',
      right: 0,
    },
    editImageIcon: {
      position: 'relative',
      color: colors.editIcon,
      padding: 5,
    },
    songTitle: {
      fontSize: 20,
      fontWeight: 600,
      textAlign: 'center',
      color: colors.text,
    },
    songArtist: {
      fontSize: 17,
      fontWeight: 300,
      textAlign: 'center',
      color: colors.text,
    },
    progressBar: {
      flexDirection: 'row',
      width: 350,
      height: 40,
      marginTop: 15,
    },
    durationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 340,
    },
    durationText: {
      fontSize: 15,
      color: colors.label,
      fontWeight: 500,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '60%',
      marginTop: 5,
    },
  });

export default makeStyles;
