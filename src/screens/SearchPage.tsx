import React, { useEffect } from 'react';

import { ScrollView, View } from 'react-native';
import SelectItem from '../class/SelectItem';
import Loading from '../common/Loading';
import {
    Button,
    RowContainer,
    Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import routes from '../navigation/routes';
import useNavigationFocus from '../navigation/useNavigationFocus';
import Constants from '../constants/Constants';

const SearchPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[][]>([]);
    const [keyboardType, setKeyboardType] = React.useState(Constants.quick);
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();
    const [input, setInput] = React.useState('');
    const [quickWord, setQuickWord] = React.useState('');
    const [wordSelection, setWordSelection] = React.useState('');
    const [quickDict, setQuickDict] = React.useState([]);

    useEffect(() => {
        let dict = require('../../assets/ms_quick.dict.json');
        setQuickDict(dict);
    }, [])

    useEffect(() => {
        switch (keyboardType) {
            case Constants.quick:
                getQuickKeyboard();
                break;
            case Constants.alphanumeric:
                break;
        }
    }, [keyboardType])

    const getQuickKeyboard = () => {
        let keybord = 
        setList(list);
    }

    const onSelectItem = (item: SelectItem) => {
        if (quickWord.length == 1) {
            setQuickWord(quickWord + item.title);
        } else {
            setQuickWord(item.title);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text>{quickWord}</Text>
            <Text>{input}</Text>
            {list.map(l => (
                <RowContainer>
                    {l.map(k => (
                        <Button mode='outlined' key={k.id} onPress={() => onSelectItem(k)}>{k.title}</Button>
                    ))}
                </RowContainer>
            ))}
        </ScrollView>
    );
};

export default SearchPage;
