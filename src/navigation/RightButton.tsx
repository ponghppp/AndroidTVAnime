import React from 'react';
import {
    Modal,
    useTVEventHandler,
    View,
    ViewStyle
} from 'react-native';

import {
    Button,
    SectionContainer,
    Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import api from '../api/api';

const RightButton = () => {
    const [modalShown, setModalShown] = React.useState(false);
    const [tvEventName, setTvEventName] = React.useState('');
    const [tvEventsShown, setTVEventsShown] = React.useState(false);
  
    const {colors} = useTVTheme();
  
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
              <Button mode="contained" onPress={() => api.deleteVideoRecord()}>{'刪除影片記錄'}</Button>
              <Button mode="contained" onPress={() => setModalShown(false)}>
                {'關閉'}
              </Button>
            </SectionContainer>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default RightButton;