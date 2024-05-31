import React, { useCallback, useEffect } from 'react';

import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import api from '../api/api';
import SelectItem from '../class/SelectItem';
import Loading from '../common/Loading';
import {
    Button
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import routes from '../navigation/routes';
import useNavigationFocus from '../navigation/useNavigationFocus';
import SecureStorage from '../common/SecureStorage';
import Constants from '../constants/Constants';
import Record from '../class/Record';

const SeriesPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [seriesList, setSeriesList] = React.useState<SelectItem[]>([]);
    const [list, setList] = React.useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const route = useRoute();
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();

    useEffect(() => {
        adjustList();
    },[seriesList]);

    useFocusEffect(
        useCallback(() => {
            let id = route.params['id'];
            const getList = async () => {
                let list = await api.getSeries(id, route.params['header']);
                setSeriesList(list);
                setIsLoading(false);
            };
            setIsLoading(true);
            getList();
        }, [])
    );

    const adjustList = async () => {
        let current = await SecureStorage.getItem(Constants.current);
        let records = await SecureStorage.getItem(Constants.record);
        if (records != '') {
            let json: Record[] = JSON.parse(records);
            json.forEach(rec => {
                let record = seriesList.find(l => l.id == rec.videoId);
                if (record != undefined) {
                    record.data['percentage'] = (rec.currentTime / rec.duration) * 100
                }
            });
            let currentRecord = seriesList.find(l => l.id == current);
            if (currentRecord != undefined) {
                currentRecord.focus = true;
            }
        }
        setList(seriesList);
    }
 
    const onSelectItem = (item: SelectItem) => {
        let id = route.params['id'];
        let data = { list, selectedId: item.id, seriesId: id, header: route.params['header'] };
        navigation.navigate(routes.Video.key, data);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <Loading show={isLoading} />
                {list && list.map(item => (
                    <Button mode='outlined' hasTVPreferredFocus={item.focus} percentage={item.data['percentage']} key={item.id} onPress={() => onSelectItem(item)}>{item.title}</Button>
                ))}
            </View>
        </ScrollView>
    );
};

export default SeriesPage;
