import React from 'react';

import { Image, StyleSheet, View } from 'react-native';
import { Text } from './StyledComponents';
import { useTVTheme } from './TVTheme';

const FloatLoading = (props: { show: boolean }) => {
    const { show } = props;
    const { styles } = useTVTheme();
    const containerStyle = { ...styleSheet.container, display: show ? 'flex' : 'none' }
    return (
        <View style={containerStyle}>
            <Image style={styleSheet.image} source={require('../../assets/little_twin_stars.gif')}></Image>
            <Text>{'載入中...'}</Text>
        </View>
    );
};

const styleSheet = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 2
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain'
    }
});

export default FloatLoading;
