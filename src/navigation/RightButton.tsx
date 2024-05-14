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
        <Button onPress={() => setModalShown(!modalShown)}>Source</Button>
        <Modal
          animationType="fade"
          transparent
          visible={modalShown}
          onRequestClose={() => setModalShown(false)}>
          <View style={modalStyle}>
            <SectionContainer title="About">
              <Text>
                A demo of various APIs and components provided by React Native for
                TV.
              </Text>
              <Text>{hermesText}</Text>
              <Button onPress={() => setTVEventsShown(!tvEventsShown)}>
                {tvEventsShown ? 'Hide TV events' : 'Show TV events'}
              </Button>
              <Button mode="contained" onPress={() => setModalShown(false)}>
                Dismiss
              </Button>
            </SectionContainer>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default RightButton;