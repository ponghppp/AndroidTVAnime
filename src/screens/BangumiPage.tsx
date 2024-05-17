import React, { useEffect } from 'react';

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

const BangumiPage = (props: { navigation: any }) => {
    const { navigation } = props;
    const [navFocused, setNavFocused] = React.useState(false);
    const [list, setList] = React.useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    useNavigationFocus(navigation, setNavFocused);
    const { styles } = useTVTheme();

    useEffect(() => {
        const getList = async () => {
            let seasons = api.getSeasons();
            let list = [];
            seasons.forEach(y => {
                y['seasons'].forEach(s => {
                    list.push(
                        {
                            id: `${y['year']}年${s}季新番`,
                            title: `${y['year']}年${s}季新番`,
                            header: `${y['year']}年${s}季新番`,
                        } as SelectItem
                    );
                });
            });
            setList(list);
        };
        getList();
    }, [])

    const onSelectItem = (item: SelectItem) => {
        navigation.navigate(routes.Season.key, item)
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

export default BangumiPage;
