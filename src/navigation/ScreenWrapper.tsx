import React, { SetStateAction, useState } from 'react';
import {
    BackHandler,
    NativeEventSubscription,
    TVEventControl,
    View
} from 'react-native';

import { useTVTheme } from '../common/TVTheme';
import componentForRoute from '../navigation/componentForRoute';
import Header from './Header';
import routes from './routes';


const ScreenWrapper = (props: { navigation: any; route: any }) => {
    const { navigation, route } = props;
    const { styles, sizes } = useTVTheme();
    const [backAction, setBackAction] = useState<() => void>();
    const [handler, setHandler] = useState<NativeEventSubscription>();

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
        setHandler(backHandler);
        // This cleans up the back nav handler on unmount
        return () => {
            backHandler.remove();
            TVEventControl.disableTVMenuKey();
        };
    }, []);

    React.useEffect(() => {
        if (handler) {
            BackHandler.removeEventListener('hardwareBackPress', () => true);
            handler.remove();
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                if (backAction != undefined) {
                    backAction();
                    return true;
                }
                else {
                    navigation.goBack();
                    return true;
                }
            },
        );
    }, [backAction, handler]);

    const r = Object.values(routes).find(r => r.key == route.name);
    const title = route.params?.header ?? r.title;
    const showHeader = r.isShowHeader
    return (
        <View style={styles.container}>
            {showHeader && <Header
                navigation={navigation}
                canGoBack={navigation.canGoBack()}
                title={title} />}
            {componentForRoute(route.name, { navigation, setBackAction })}
        </View>
    );
};

export default ScreenWrapper;