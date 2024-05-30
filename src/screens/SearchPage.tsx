import React, { useCallback, useEffect, useRef } from 'react';

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
import routes from '../navigation/routes';

const SearchPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[][]>([]);
    const [keyboardType, setKeyboardType] = React.useState(Constants.quick);
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();
    const [input, setInput] = React.useState('');
    const [quickWord, setQuickWord] = React.useState('');
    const [quickWordSelection, setQuickWordSelection] = React.useState<SelectItem[]>([]);
    const [quickDict, setQuickDict] = React.useState({});
    const [keyboard, setKeyboard] = React.useState<[[{ key: string, value: string }]]>();
    const [isCap, setIsCap] = React.useState(false);

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
                    setQuickWord('');
                    setQuickWordSelection([]);
                    getAlphanumericKeyboard(isCap);
                    break;
            }
        }
    }, [keyboard, keyboardType, isCap, quickWord])

    useEffect(() => {
        if (quickDict != undefined) {
            let array: [string, string][] = Object.entries(quickDict);
            let alphabets = mapQuickWordAlphabet()
            let filteredWords = array.filter(a => a[1] == alphabets.join(''));
            let selections = filteredWords.map(w => ({ id: w[0], title: w[0], force: quickWord.length == 1 } as SelectItem))
            setQuickWordSelection(selections);
        }
    }, [quickWord])

    useFocusEffect(
        useCallback(() => {
            setKeyboardType(Constants.quick);
        }, [])
    );

    const mapQuickWordAlphabet = () => {
        let list: string[] = [];
        for (var i = 0; i < quickWord.length; i++) {
            let row = keyboard.find(k => k.find(w => w.value == quickWord[i]));
            let obj = row.find(w => w.value == quickWord[i]);
            list.push(obj.key);
        }
        return list;
    }

    const getQuickKeyboard = () => {
        let keys = keyboard.slice(1, keyboard.length);
        let list = keys.map(r => r.map(k => ({ id: k.key, title: k.value, hover: quickWord.includes(k.value) } as SelectItem)))
        list[1].splice(list[1].length, 0, ({ id: 'del', title: '⌫' } as SelectItem));
        list[2].splice(list[2].length, 0, ({ id: 'lang', title: '🌎' } as SelectItem));
        list[2].splice(list[2].length, 0, ({ id: 'enter', title: '⎆' } as SelectItem));
        setList(list);
    }

    const getAlphanumericKeyboard = (isUpper: boolean) => {
        let list = keyboard.map(r => r.map(k => ({ id: k.key, title: isUpper ? k.key.toUpperCase() : k.key } as SelectItem)))
        list[2].splice(list[2].length, 0, ({ id: 'del', title: '⌫' } as SelectItem));
        list[2].splice(0, 0, ({ id: 'shift', title: '⇧', hover: isCap } as SelectItem));
        list[3].splice(list[3].length, 0, ({ id: 'lang', title: '🌎' } as SelectItem));
        list[3].splice(list[3].length, 0, ({ id: 'enter', title: '⎆' } as SelectItem));
        setList(list);
    }

    const deleteWord = () => {
        if (quickWord.length > 0) {
            setQuickWord(quickWord.substring(0, quickWord.length - 1));
        }
        else {
            setInput(input.substring(0, input.length - 1));
        }
    }

    const onSelectItem = (item: SelectItem) => {
        if (!item.id.match(/[a-z]/i) || item.force) {
            setInput(input + item.title);
            setQuickWord('');
            setQuickWordSelection([]);
            return;
        }
        if (item.id == 'enter') {
            navigation.navigate(routes.Result.key, input)
            return;
        }
        if (item.id == 'shift') {
            setIsCap(!isCap);
            return;
        }
        if (item.id == 'del') {
            deleteWord();
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
            if (quickWord.length < 2) {
                setQuickWord(quickWord + item.title);
            }
        }
        else {
            setInput(input + item.title);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={{ fontSize: 30, textAlign: 'center' }}>{input}</Text>
            <ScrollView horizontal={true}>
                <RowContainer>
                    {quickWordSelection.map(k => (
                        <Button mode={'outlined'} key={k.id} onPress={() => onSelectItem(k)}>{k.title}</Button>
                    ))}
                    <View style={{height: 70}}></View>
                </RowContainer>
            </ScrollView>
            {list.map(l => (
                <CenterRowContainer>
                    {l.map(k => (
                        <Button mode={k.hover ? 'contained' : 'outlined'} key={k.id} onPress={() => onSelectItem(k)}>{k.title}</Button>
                    ))}
                </CenterRowContainer>
            ))}
        </ScrollView>
    );
};

export default SearchPage;
