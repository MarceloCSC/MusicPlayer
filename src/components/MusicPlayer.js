import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import makeStyles from '../styles/StyleSheet';
import {songs} from '../model/Data';
import {darkTheme, lightTheme} from '../styles/Theme';
import ImagePickerModal from './ImagePickerModal';

// Objeto com as dimensões da tela
const width = Dimensions.get('window').width;

// Configurando o player. Segundo a documentação da biblioteca o setup deve ser feito antes de
// outras funções para evitar instabilidade. Mais informações em https://react-native-track-player.js.org/
const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    // Adiciona as músicas ao player
    await TrackPlayer.add(songs);
  } catch (e) {
    console.log(e);
  }
};

const MusicPlayer = ({navigation}) => {
  // Hook para verificar o estado do player: None | Ready | Playing | Paused | Stopped | Buffering | Connecting
  const playbackState = usePlaybackState();
  // Hook para acompanhar o progresso da faixa sendo tocada
  const {position} = useProgress();

  // Refs para a FlatList que renderizará as imagens e permite scroll entre as faixas
  const flatList = useRef(null);
  const xOffset = useRef(new Animated.Value(0)).current;

  // Index da faixa atual
  const [trackIndex, setTrackIndex] = useState(0);
  // Array com informações de todas as faixas da playlist
  const [tracksInfo, setTracksInfo] = useState([
    {
      id: songs[0].id,
      title: songs[0].title,
      artist: songs[0].artist,
      album: songs[0].album,
      artwork: songs[0].artwork,
      duration: songs[0].duration,
      url: songs[0].url,
    },
  ]);
  // Dark mode ativo ou inativo
  const [darkMode, setDarkMode] = useState(true);
  // Modo de repetição: off | once | repeat - desligado | repete a faixa | repete a playlist
  const [repeatMode, setRepeatMode] = useState('off');
  // Modo aleatório ativo ou inativo
  const [shuffleMode, setShuffleMode] = useState(false);
  // Exibir ou não modal para mudar imagem
  const [showModal, setShowModal] = useState(false);

  // Tema de cores atual: dark | light - escuro | claro
  const colors = darkMode ? darkTheme : lightTheme;
  // Cria o StyleSheet com base no tema atual e o tamanho da tela
  const styles = makeStyles(colors, width);

  // Pula para a faixa de acordo com o index
  const skipTo = async trackIndex => {
    setTrackIndex(trackIndex);

    await TrackPlayer.skip(trackIndex);
    await TrackPlayer.play();
  };

  // Ao arrastar o slider de progresso da faixa, este método deveria pular para o ponto correto da faixa
  // Porém, por algum motivo o método TrackPlayer.seekTo() não está funcionando. Parece ser algum problema da
  // biblioteca. Procurei no Stack Overflow e outros lugares, mas não encontrei uma forma de resolver esse problema
  const seekTo = async timestamp => {
    console.log(timestamp);
    await TrackPlayer.seekTo(timestamp);
  };

  // Hook para responder aos eventos emitidos pelo player
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    // Caso a faixa de áudio mude e não for a última faixa da playlist
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      // O index da nova faixa
      const index = await TrackPlayer.getCurrentTrack();

      // Neste caso a faixa foi trocada automaticamente pelo próprio player e não pelo usuário
      if (index !== trackIndex) {
        // Muda a imagem exibida de acordo com a nova faixa
        flatList.current.scrollToOffset({
          offset: index * width,
        });
        // Atualiza o index da faixa atual
        setTrackIndex(index);
      }
    }
  });

  useEffect(() => {
    // A configuração inicial do player
    setupPlayer();

    // Cria uma array com as informações básicas de todas as faixas da playlist
    setTracksInfo(
      songs.map(song => {
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          artwork: song.artwork,
          duration: song.duration,
          url: song.url,
        };
      }),
    );

    // Registra evento sempre que a imagem da FlatList for rolada
    xOffset.addListener(({value}) => {
      // Caso o resto dessa divisão não seja 0, a imagem ainda está sendo rolada e não chegou à posição final
      if (
        Math.floor(value % width) === 0 ||
        // Matematicamente o resto deveria sempre ser zero, já que estamos dividindo um número por seu divisor
        // Porém, em alguns casos percebi que o resto é igual ao width - acredito que seja algum problema de arredondamento
        Math.floor(value % width) === Math.floor(width)
      ) {
        // Dividindo o valor do offset horizontal pelo tamanho da tela, chegamos ao index da imagem atual
        const index = Math.round(value / width);
        // Pula para a faixa seguinte, de acordo com o index
        skipTo(index);
      }
    });

    return () => {
      xOffset.removeAllListeners();
    };
  }, []);

  // Método para começar a tocar ou pausar a faixa
  const handlePlayback = async playbackState => {
    if (playbackState !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  // Método para atualizar a imagem quando o usuário pula para a faixa seguinte
  const nextTrack = () => {
    flatList.current.scrollToOffset({
      offset: (trackIndex + 1) * width,
    });
  };

  // Método para atualizar a imagem quando o usuário pula para a faixa anterior
  const previousTrack = () => {
    flatList.current.scrollToOffset({
      offset: (trackIndex - 1) * width,
    });
  };

  // Alterna entre os três modos de repetição
  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('once');
    } else if (repeatMode === 'once') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('');
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  // TO DO!
  // Ativa ou desativa o modo aleatório - falta implementar
  const shuffle = () => {
    setShuffleMode(!shuffleMode);
  };

  // Formata a duração da faixa para o modelo: 00:00
  const getDuration = duration => {
    return new Date(duration * 1000).toLocaleTimeString().substring(3, 8);
  };

  // Retorna o componente de imagem para ser usado na FlatList
  const renderArtwork = ({item, index}) => {
    return (
      <Animated.View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={item.uri ? {uri: item.uri} : item.artwork}
            style={styles.image}
          />

          {/* Botão para alterar a imagem associada à faixa */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.editImageBtn}>
            <MaterialCommunityIcons
              name="image-edit"
              size={30}
              style={styles.editImageIcon}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const changeImage = uri => {
    let updatedInfo = tracksInfo.map((track, index) => {
      if (index == trackIndex) {
        return {...track, uri: uri};
      }
      return track;
    });

    setTracksInfo(updatedInfo);
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        {/* FlatList que renderiza as imagens e possibilita o scroll */}
        <Animated.FlatList
          ref={flatList}
          renderItem={renderArtwork}
          data={tracksInfo}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x: xOffset},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        {/* Nome da faixa e do artista */}
        <View>
          <Text style={styles.songTitle}>{tracksInfo[trackIndex]?.title}</Text>
          <Text style={styles.songArtist}>
            {tracksInfo[trackIndex]?.artist}
          </Text>
        </View>

        <View>
          {/* Slider com o progresso da faixa sendo tocada */}
          <Slider
            style={styles.progressBar}
            value={position}
            minimumValue={0}
            maximumValue={tracksInfo[trackIndex]?.duration}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.slider}
            thumbTintColor={colors.primary}
            onValueChange={seekTo}
          />

          {/* Mostra o tempo atual da faixa e o tempo restante para o fim da faixa */}
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{getDuration(position)}</Text>
            <Text style={styles.durationText}>
              {getDuration(tracksInfo[trackIndex]?.duration - position)}
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {/* Botão para voltar à faixa anterior */}
          <TouchableOpacity onPress={previousTrack}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Botão central para tocar ou pausar a faixa */}
          <TouchableOpacity onPress={() => handlePlayback(playbackState)}>
            <Ionicons
              name={
                playbackState === State.Playing ||
                playbackState === State.Buffering
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={75}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Botão para avançar à faixa seguinte */}
          <TouchableOpacity onPress={nextTrack}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.iconsRow}>
          {/* Botão para curtir a faixa */}
          <TouchableOpacity
            onPress={() => navigation.push('Playlists Salvas', {})}>
            <MaterialCommunityIcons
              name="playlist-plus"
              size={30}
              color={colors.secondary}
            />
          </TouchableOpacity>

          {/* Botão para mudar o modo de repetição */}
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={'repeat' + (repeatMode === '' ? '' : '-' + repeatMode)}
              size={30}
              color={repeatMode === 'off' ? colors.secondary : colors.primary}
            />
          </TouchableOpacity>

          {/* Botão para ativar ou desativar o modo aleatório */}
          <TouchableOpacity onPress={shuffle}>
            <MaterialCommunityIcons
              name="shuffle"
              size={30}
              color={shuffleMode ? colors.primary : colors.secondary}
            />
          </TouchableOpacity>

          {/* Botão para ativar ou desativar o Dark Mode */}
          <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
            <MaterialCommunityIcons
              name="weather-night"
              size={30}
              color={darkMode ? colors.primary : colors.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Modal para escolher nova imagem */}
        <ImagePickerModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          onSelectImage={changeImage}
        />
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;
