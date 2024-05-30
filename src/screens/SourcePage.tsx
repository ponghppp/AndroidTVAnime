import React from 'react';

import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import {
    Button,
    RowContainer,
    SectionContainer,
} from '../common/StyledComponents';
import Sources from '../constants/Sources';
import Constants from '../constants/Constants';
import SecureStorage from '../common/SecureStorage';
import useNavigationFocus from '../navigation/useNavigationFocus';
import routes from '../navigation/routes';


const SourcePage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    useNavigationFocus(navigation, setNavFocused);

    const onSelectSource = async (source: string) => {
        await SecureStorage.setItem(Constants.source, source);
        navigation.navigate(Object.keys(routes)[0]);
    };

    return (
        <SectionContainer title=" ">
            <RowContainer>
                {
                    Object.values(Sources).map(s => (
                        <Button mode="contained" onPress={() => onSelectSource(s)}>{s}</Button>
                    ))
                }
            </RowContainer>
        </SectionContainer>
    );
};

export default SourcePage;
