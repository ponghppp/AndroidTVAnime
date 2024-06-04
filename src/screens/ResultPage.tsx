import React, { useEffect } from 'react';

import { ScrollView, View } from 'react-native';
import api from '../api/api';
import SelectItem from '../class/SelectItem';
import {
    Button
} from '../common/StyledComponents';
import { useTVTheme } from '../common/TVTheme';
import routes from '../navigation/routes';
import useNavigationFocus from '../navigation/useNavigationFocus';
import Loading from '../common/Loading';
import { useRoute } from '@react-navigation/native';
import anime1Api from '../api/anime1Api';
import SecureStorage from '../common/SecureStorage';
import Sources from '../constants/Sources';

const ResultPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();
    const route = useRoute();

    useEffect(() => {
        const getList = async () => {
            let input = route.params;
            let list = await api.searchAnime(`${input}`);
            setList(list);
            setIsLoading(false);
        };
        setIsLoading(true);
        getList();

    }, [])

    const onSelectItem = async (item: SelectItem) => {
        if (await SecureStorage.getSource() == Sources.Anime1) {
            let seriesId = await anime1Api.getSeriesIdByCategoryId(item.id);
            item.id = seriesId;
        }
        navigation.navigate(routes.Series.key, item)
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Loading show={isLoading} />
                {list.map(item => (
                    <Button mode='outlined' key={item.id} onPress={() => onSelectItem(item)}>{item.title}</Button>
                ))}
            </View>
        </ScrollView>
    );
};

export default ResultPage;
