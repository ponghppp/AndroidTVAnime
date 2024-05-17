import React, { useEffect } from 'react';

import { useRoute } from '@react-navigation/native';
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

const SeriesPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const route = useRoute();
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();

    useEffect(() => {
        let id = route.params['id'];
        setIsLoading(true);
        const getList = async () => {
            let list = await api.getSeries(id);
            setList(list);
            setIsLoading(false);
        };
        setIsLoading(true);
        getList();
    }, []);

    const onSelectItem = (item: SelectItem) => {
        let data = { list, selectedId: item.id, seriesId: route.params['id'] };
        navigation.navigate(routes.Video.key, data);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <Loading show={isLoading} />
                {list.map(item => (
                    <Button mode='outlined' key={item.id} onPress={() => onSelectItem(item)}>{item.title}</Button>
                ))}
            </View>
        </ScrollView>
    );
};

export default SeriesPage;
