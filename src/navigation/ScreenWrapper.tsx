import React from 'react';
import {
    BackHandler,
    TVEventControl,
    View
} from 'react-native';

import {
    BackButton
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import { componentForRoute } from './routes';


const ScreenWrapper = (props: { navigation: any; route: any }) => {
    const { navigation, route } = props;
    const { styles, sizes } = useTVTheme();

    React.useEffect(() => {
        // On Apple TV, the menu key must not have an attached gesture handler,
        // otherwise it will not navigate out of the app back to the Apple TV main screen
        // as expected by Apple guidelines.
        TVEventControl.enableTVMenuKey();
        // Enable back navigation with Apple TV menu key or Android back button
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.goBack();
                return true;
            },
        );
        // This cleans up the back nav handler on unmount
        return () => {
            backHandler.remove();
            TVEventControl.disableTVMenuKey();
        };
    });
    return (
        <View style={styles.container}>
            <View style={{ height: sizes.headerHeight }} />
            {componentForRoute(route.name, { navigation })}
            <View style={styles.container} />
            <BackButton onPress={() => navigation.goBack()}>Back</BackButton>
        </View>
    );
};

export default ScreenWrapper;