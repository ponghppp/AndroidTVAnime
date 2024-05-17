import React from 'react';
import {
  View
} from 'react-native';

import {
  Button,
  Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import RightButton from './RightButton';

const Header = (props: {
  title: string;
  canGoBack?: boolean;
  navigation?: any;
}) => {
  const { styles } = useTVTheme();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {props.canGoBack ? (
          <Button onPress={() => props.navigation.goBack()}>{'返回'}</Button>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{props.title}</Text>
      </View>
      <View style={styles.headerRight}>
        <RightButton />
      </View>
    </View>
  );
};
export default Header;