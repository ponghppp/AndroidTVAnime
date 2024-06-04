import React, { useCallback } from 'react';
import {
  Modal,
  useTVEventHandler,
  View,
  ViewStyle
} from 'react-native';

import api from '../api/api';
import SecureStorage from '../common/SecureStorage';
import {
  Button,
  SectionContainer,
  Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import Constants from '../constants/Constants';
import Sources from '../constants/Sources';
import { useFocusEffect } from '@react-navigation/native';

const RightButton = (props: {
  title: string;
  canGoBack?: boolean;
  navigation?: any;
}) => {
  const [modalShown, setModalShown] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [sourceModalShown, setSourceModalShown] = React.useState(false);
  const [tvEventName, setTvEventName] = React.useState('');
  const [tvEventsShown, setTVEventsShown] = React.useState(false);
  const { title, canGoBack, navigation } = props;

  const { colors } = useTVTheme();

  useFocusEffect(
    useCallback(() => {
      const getSource = async () => {
        let source = await SecureStorage.getSource();
        setSource(source);
      }
      getSource();
    }, [])
  );

  useTVEventHandler(event => {
    setTvEventName(event.eventType);
  });

  const modalStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    opacity: 0.95,
  };

  const aboutStyle: ViewStyle = {
    minHeight: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const version =
    (global as any).HermesInternal?.getRuntimeProperties?.()[
    'OSS Release Version'
    ] ?? '';

  const hermesText = (global as any).HermesInternal
    ? `Engine: Hermes ${version}`
    : '';

  const deleteBtnPressed = () => {
    api.deleteVideoRecord();
  }

  const sourceBtnPressed = () => {
    setModalShown(false);
    setSourceModalShown(true);
  }

  const sourceModelClose = () => {
    setModalShown(false);
    setSourceModalShown(false);
  }

  const sourceModelBack = () => {
    setModalShown(true);
    setSourceModalShown(false);
  }

  const sourceSelected = (source: string) => {
    SecureStorage.setItem(Constants.source, source);
    sourceModelClose();
    if (canGoBack) navigation.popToTop();
  }

  return (
    <View style={aboutStyle}>
      {tvEventsShown ? <Text>{tvEventName}</Text> : null}
      <Button onPress={() => setModalShown(!modalShown)}>{'設定'}</Button>
      <Modal
        animationType="fade"
        transparent
        visible={modalShown}
        onRequestClose={() => setModalShown(false)}>
        <View style={modalStyle}>
          <SectionContainer title="設定">
            <Text>{hermesText}</Text>
            <Text>{'影片來源: ' + source}</Text>
            <Button mode="contained" onPress={sourceBtnPressed}>{'影片來源'}</Button>
            <Button mode="contained" onPress={deleteBtnPressed}>{'刪除影片記錄'}</Button>
            <Button mode="contained" onPress={() => setModalShown(false)}>{'關閉'}</Button>
          </SectionContainer>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={sourceModalShown}
        onRequestClose={sourceModelBack}>
        <View style={modalStyle}>
          <SectionContainer title="影片來源">
            {Object.values(Sources).map(s => (
              <Button mode="contained" key={s} onPress={() => sourceSelected(s)}>{s}</Button>
            ))}
            <Button mode="contained" onPress={sourceModelClose}> {'關閉'}</Button>
          </SectionContainer>
        </View>
      </Modal>
    </View>
  );
};

export default RightButton;