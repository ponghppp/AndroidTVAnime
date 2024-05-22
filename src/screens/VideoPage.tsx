import {
  AVPlaybackStatus,
  Video,
  VideoReadyForDisplayEvent
} from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { ResizeMode } from "expo-av";
import api from '../api/api';
import SelectItem from '../class/SelectItem';
import FloatLoading from '../common/FloatLoading';
import VideoControls from "../common/VideoControls";
import useNavigationFocus from '../navigation/useNavigationFocus';
import SecureStorage from '../common/SecureStorage';
import Constants from '../constants/Constants';
import Record from '../class/Record';

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoPage = () => {
  const video = React.useRef<Video>();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasNavigationFocus, setHasNavigationFocus] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowControl, setIsShowControl] = React.useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
  const timerRef = useRef(null);
  const route = useRoute();
  const navigation = useNavigation();
  useNavigationFocus(navigation, setHasNavigationFocus);

  useEffect(() => {
    const getDownloadVideo = async () => {
      let selected = (route.params['list'] as SelectItem[]).find(s => s.id == route.params['selectedId']);
      let data = await api.downloadVideo(selected.data['apireq']);
      console.log(data)

      await video.current.loadAsync({ uri: data.url, headers: { cookie: data.cookie } });
      await video.current.setProgressUpdateIntervalAsync(1000);
      let records = await SecureStorage.getItem(Constants.record);
      if (records != '') {
        let json: Record[] = JSON.parse(records);
        let record = json.find(j => j.videoId == route.params['selectedId']);
        if (record != undefined) {
          await video.current.setPositionAsync(record.currentTime);
        }
      }
      await video.current.playAsync();
      setIsVideoLoaded(true);
      setIsPlaying(true);
    };
    video.current.setVolumeAsync(1);
    setIsLoading(true);
    getDownloadVideo();
    return stopTimer();
  }, []);

  useEffect(() => {
    if (isShowControl) {
      startTimer();
    }
  }, [isShowControl]);

  useEffect(() => {
    if (!isPlaying) {
      stopTimer();
      recordVideo();
      video.current.pauseAsync();
    } else {
      startTimer();
      video.current.playAsync();
    }
  }, [isPlaying]);

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      setIsShowControl(false);
    }, 2000);
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  const recordVideo = () => {
    let selected = (route.params['list'] as SelectItem[]).find(s => s.id == route.params['selectedId']);
    let record: Record = {videoId: route.params['selectedId'],
      currentTime: currentTime,
      duration: duration,
      seriesId: route.params['seriesId'],
      videoName: selected.title
    }
    api.recordVideo(record);
  }

  //sets the current time, if video is finished, moves to the next video
  const handlePlaybackStatusUpdate = (status) => {
    if (isVideoLoaded) {
      recordVideo();
    }
    setCurrentTime(status.positionMillis);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextVideo = () => {

  };

  const playPreviousVideo = () => {

  };

  const togglePlaybackSpeed = () => {
    //gets the next playback speed index
    const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
    if (nextSpeedIndex < playbackSpeedOptions.length) {
      video.current.setRateAsync(playbackSpeedOptions[nextSpeedIndex], true);
      setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
    }
    //if the last option i.e. 2x speed is applied. then moves to first option 
    else {
      video.current.setRateAsync(playbackSpeedOptions[0], true);
      setPlaybackSpeed(playbackSpeedOptions[0]);
    }
  };

  const singleTap = () => {
    if (!isShowControl) {
      setIsShowControl(true);
    }
  };

  const handleReadyForDisplay = async (event: VideoReadyForDisplayEvent) => {
    setDuration(event.status['durationMillis'])
    setIsLoading(false);
  }

  let selected = (route.params['list'] as SelectItem[]).find(s => s.id == route.params['selectedId']);
  let videoName = selected.title;
  return (
    <View style={styles.videoContainer}>
      <FloatLoading show={isLoading} />
      <TouchableOpacity activeOpacity={1} onPress={singleTap} style={styles.videoContainer}>
        <Video
          ref={video}
          // source={require('../../assets/bach-handel-corelli.mp4')}
          rate={playbackSpeed}
          isMuted={isMuted}
          shouldPlay={isPlaying}
          resizeMode={ResizeMode.STRETCH}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onReadyForDisplay={handleReadyForDisplay}
          style={{ flex: 1 }}
        />
      </TouchableOpacity>
      {isShowControl &&
        <VideoControls
          onTogglePlayPause={togglePlayPause}
          onPlayPreviousVideo={playPreviousVideo}
          onPlayNextVideo={playNextVideo}
          onTogglePlaybackSpeed={togglePlaybackSpeed}
          onSeek={(value) => {
            video.current.setPositionAsync(currentTime + value);
            setCurrentTime(currentTime + value);
          }}
          duration={duration}
          currentTime={currentTime}
          rate={playbackSpeed}
          shouldPlay={isPlaying}
          videoName={videoName}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1
  }
});

export default VideoPage;

