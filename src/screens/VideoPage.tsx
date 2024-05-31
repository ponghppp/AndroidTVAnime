import {
  Video,
  VideoReadyForDisplayEvent
} from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useRoute } from '@react-navigation/native';
import { ResizeMode } from "expo-av";
import api from '../api/api';
import Record from '../class/Record';
import SelectItem from '../class/SelectItem';
import FloatLoading from '../common/FloatLoading';
import SecureStorage from '../common/SecureStorage';
import VideoControls from "../common/VideoControls";
import Constants from '../constants/Constants';
import useNavigationFocus from '../navigation/useNavigationFocus';

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoPage = (props: { navigation: any, setBackAction: React.Dispatch<React.SetStateAction<() => void>> }) => {
  const { setBackAction } = props;
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
  const [currentId, setCurrentId] = useState('');
  const { navigation } = props;

  useNavigationFocus(navigation, setHasNavigationFocus);

  useEffect(() => {
    video.current.setVolumeAsync(1);
    setIsLoading(true);
    setCurrentId(route.params['selectedId']);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    video.current.stopAsync();
    if (currentId != '') {
      recordVideo();
      SecureStorage.setItem(Constants.current, currentId);
      downloadVideo();
    }
  }, [currentId]);

  useEffect(() => {
    if (!isPlaying) {
      recordVideo();
      video.current.pauseAsync();
    } else {
      video.current.playAsync();
    }
  }, [isPlaying]);

  useEffect(() => {
    setBackAction(() => backAction);
  }, [isShowControl]);

  const downloadVideo = async () => {
    let selected = (route.params['list'] as SelectItem[]).find(s => s.id == currentId);
    let data = await api.downloadVideo(selected.data['apireq']);

    await video.current.loadAsync({ uri: data.url, headers: { cookie: data.cookie, referer: data.referer } });
    await video.current.setProgressUpdateIntervalAsync(1000);
    let records = await SecureStorage.getItem(Constants.record);
    if (records != '') {
      let json: Record[] = JSON.parse(records);
      let record = json.find(j => j.videoId == currentId);
      if (record != undefined) {
        await video.current.setPositionAsync(record.currentTime);
      }
    }
    await video.current.playAsync();
    setIsVideoLoaded(true);
    setIsPlaying(true);
  }

  const backAction = () => {
    if (isShowControl) {
      setIsShowControl(false);
    } else {
      navigation.goBack();
    }
  }

  const recordVideo = async () => {
    let selected = (route.params['list'] as SelectItem[]).find(s => s.id == currentId);
    let record: Record = {
      videoId: currentId,
      currentTime: currentTime,
      duration: duration,
      seriesId: route.params['seriesId'],
      videoName: selected.title,
      viewEpoch: Date.now(),
      source: await SecureStorage.getSource()
    }
    api.recordVideo(record);
  }

  //sets the current time, if video is finished, moves to the next video
  const handlePlaybackStatusUpdate = (status) => {
    if (isVideoLoaded) {
      recordVideo();
    }
    if (duration == 0) {
      setDuration(status.durationMillis);
    }
    setCurrentTime(status.positionMillis);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextVideo = () => {
    let list = [...(route.params['list'] as SelectItem[])].reverse();
    let currentIdx = list.findIndex(s => s.id == currentId);
    let nextIdx = Math.min(list.length - 1, currentIdx + 1);
    let nextId = list[nextIdx].id;
    if (currentId != nextId) setCurrentId(nextId);
  };

  const playPreviousVideo = () => {
    let list = [...(route.params['list'] as SelectItem[])].reverse();
    let currentIdx = list.findIndex(s => s.id == currentId);
    let nextIdx = Math.max(0, currentIdx - 1);
    let nextId = list[nextIdx].id;
    if (currentId != nextId) setCurrentId(nextId);
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

  let selected = (route.params['list'] as SelectItem[]).find(s => s.id == currentId);
  let videoName = selected?.title ?? '';
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

