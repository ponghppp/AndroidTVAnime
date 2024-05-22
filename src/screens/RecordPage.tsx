import React, { useCallback, useEffect } from 'react';

import { ScrollView, View } from 'react-native';
import SelectItem from '../class/SelectItem';
import Loading from '../common/Loading';
import {
    Button
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import routes from '../navigation/routes';
import useNavigationFocus from '../navigation/useNavigationFocus';
import SecureStorage from '../common/SecureStorage';
import Record from '../class/Record';
import Constants from '../constants/Constants';
import { useFocusEffect } from '@react-navigation/native';

const RecordPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();

    useFocusEffect(
        useCallback(() => {
            const getList = async () => {
                let records = await SecureStorage.getItem(Constants.record);
                if (records != '') {
                    let json: Record[] = JSON.parse(records);
                    let groups = json.reduce((x, y) => {
                        (x[y.seriesId] = x[y.seriesId] || []).push(y);
                        return x;
                    }, {});
                    let list = Object.values(groups).map(g => ({
                        id: g[0]['seriesId'],
                        title: g[0]['videoName'].split(' '),
                        header: g[0]['videoName'].split(' ').slice(0, -1),
                        data: { percentage: (g[0]['currentTime'] / g[0]['duration']) * 100 }
                    } as SelectItem));
                    setList(list);
                }
            };
            getList();
        }, [])
    );

    const onSelectItem = (item: SelectItem) => {
        navigation.navigate(routes.Series.key, item)
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Loading show={isLoading} />
                {list.map(item => (
                    <Button mode='outlined' percentage={item.data['percentage']} key={item.id} onPress={() => onSelectItem(item)}>{item.title}</Button>
                ))}
            </View>
        </ScrollView>
    );
};

export default RecordPage;
