/*
 * Very simple navigation wrapper that shows a list of buttons to navigate to any of the provided examples.
 * Includes support for navigation back to the list with the menu key (Apple TV) or back key (Android TV).
 */

import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {
  View
} from 'react-native';

import {
  Button,
  Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import SourcePage from '../screens/SourcePage';
import RightButton from './RightButton';
import { routes } from './routes';
import ScreenWrapper from './ScreenWrapper';


const Stack = createStackNavigator();

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
          <Button onPress={() => props.navigation.goBack()}>Back</Button>
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
const Navigation = (): any => {
  const { colors, dark } = useTVTheme();

  const homeHeaderOptions: StackNavigationOptions = {
    headerShown: true,
    title: 'Android TV Anime',
    header: () => <Header title="Android TV Anime" />,
    headerMode: 'float',
    headerTransparent: true,
  };

  const navigationTheme = {
    dark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.backdrop,
      text: colors.text,
      border: colors.surface,
      notification: colors.error,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Source"
          component={SourcePage}
          options={homeHeaderOptions}
        />
        {Object.keys(routes)
          .map(item => {
            return { ...routes[item], key: item };
          })
          .map(item => (
            <Stack.Screen
              name={item.key}
              key={item.key}
              component={ScreenWrapper}
              options={({ navigation, route }) => ({
                ...homeHeaderOptions,
                title: route.name,
                header: () => (
                  <Header
                    navigation={navigation}
                    title={route.name}
                    canGoBack
                  />
                ),
              })}
            />
          ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
