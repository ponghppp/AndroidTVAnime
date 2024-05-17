import React from 'react';

import { View } from 'react-native';
import {
  Button,
  SectionContainer
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import routes from '../navigation/routes';
import useNavigationFocus from '../navigation/useNavigationFocus';

const HomePage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const {styles, sizes} = useTVTheme();
    useNavigationFocus(navigation, setNavFocused);

    return (
        <View style={styles.container}>
        <SectionContainer title="">
          <View>
            {Object.values(routes).filter(r => r.isShow).map((item, i) => (
                <Button
                  mode="contained"
                  key={item.key}
                  onPress={() => navigation.navigate(item.key)}>
                  {item.title}
                </Button>
              ))}
          </View>
        </SectionContainer>
      </View>
    );
};

export default HomePage;
