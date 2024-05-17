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

import { useTVTheme } from '../common/TVTheme';
import HomePage from '../screens/HomePage';
import Header from './Header';
import routes from './routes';
import ScreenWrapper from './ScreenWrapper';

const Stack = createStackNavigator();

const Navigation = (): any => {
  const { colors, dark } = useTVTheme();

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
        {Object.values(routes).map(item => (
          <Stack.Screen
            name={item.key}
            key={item.key}
            component={ScreenWrapper}
            options={({ navigation, route }) => ({
              title: route.name,
              headerShown: false,
            })}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
