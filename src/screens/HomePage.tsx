import React from 'react';

import {
    Button,
    RowContainer,
    SectionContainer,
    Text,
} from '../common/StyledComponents';
import useNavigationFocus from '../navigation/useNavigationFocus';

const HomePage = (props: { navigation: any }) => {

    const getList = () => {
        
    }

    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    useNavigationFocus(navigation, setNavFocused);
    return (
        <RowContainer><Text>{'home'}</Text></RowContainer>
    );
};

export default HomePage;
