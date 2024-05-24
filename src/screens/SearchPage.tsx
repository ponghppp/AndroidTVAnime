import React, { useCallback, useEffect } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import SelectItem from '../class/SelectItem';
import {
    Button,
    CenterRowContainer,
    RowContainer,
    Text
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import Constants from '../constants/Constants';
import useNavigationFocus from '../navigation/useNavigationFocus';
import { useFocusEffect } from '@react-navigation/native';

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
    const [keyboard, setKeyboard] = React.useState<[[{ key: string, value: string }]]>();

    useEffect(() => {
        let dict = require('../../assets/ms_quick.dict.json');
        setQuickDict(dict);
        let k = require('../../assets/keyboard.json');
        setKeyboard(k);
    }, [])

    useEffect(() => {
        if (keyboard != undefined && keyboardType != undefined) {
            switch (keyboardType) {
                case Constants.quick:
                    getQuickKeyboard();
                    break;
                case Constants.alphanumeric:
                    getAlphanumericKeyboard(false);
                    break;
            }
        }
    }, [keyboard, keyboardType])

    useFocusEffect(
        useCallback(() => {
            setKeyboardType(Constants.quick);
        }, [])
    );

    const getQuickKeyboard = () => {
        let keys = keyboard.slice(1, keyboard.length);
        let list = keys.map(r => r.map(k => ({ id: k.key, title: k.value } as SelectItem)))
        list[1].splice(list[1].length, 0, ({ id: 'del', title: '⌫' } as SelectItem));
        list[2].splice(list[2].length, 0, ({ id: 'lang', title: '🌎' } as SelectItem));
        setList(list);
    }

    const getAlphanumericKeyboard = (isUpper: boolean) => {
        let list = keyboard.map(r => r.map(k => ({ id: k.key, title: isUpper ? k.key.toUpperCase() : k.key } as SelectItem)))
        list[1].splice(list[1].length, 0, ({ id: 'del', title: '⌫' } as SelectItem));
        list[2].splice(0, 0, ({ id: 'shift', title: '⇧' } as SelectItem));
        list[2].splice(list[2].length, 0, ({ id: 'lang', title: '🌎' } as SelectItem));
        setList(list);
    }

    const onSelectItem = (item: SelectItem) => {
        if (item.id == 'shift') {
            getAlphanumericKeyboard(true);
            return;
        }
        if (item.id == 'del') {
            setQuickWord(quickWord.substring(0, quickWord.length - 1));
            return;
        }
        if (item.id == 'lang') {
            let types = [Constants.quick, Constants.alphanumeric];
            let idx = types.indexOf(keyboardType);
            if (idx + 1 == types.length) idx = 0
            else idx += 1;
            setKeyboardType(types[idx]);
            return;
        }
        if (keyboardType == Constants.quick) {
            if (quickWord.length != 1) {
                setQuickWord(item.title);
            }
            else {
                setQuickWord(quickWord + item.title);
            }
        }
        else {
            setInput(input + item.title);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text>{quickWord}</Text>
            <Text>{input}</Text>
            {list.map(l => (
                <CenterRowContainer>
                    {l.map(k => (
                        <Button mode='outlined' key={k.id} onPress={() => onSelectItem(k)}>{k.title}</Button>
                    ))}
                </CenterRowContainer>
            ))}
        </ScrollView>
    );
};

export default SearchPage;
