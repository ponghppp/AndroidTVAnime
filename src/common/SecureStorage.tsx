import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import Sources from '../constants/Sources';
import Constants from '../constants/Constants';

const SecureStorage = {
    setItem: async (key, value) => await RNSecureStorage.setItem(key, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED }),
    getItem: async (key) => {
        let keys = await RNSecureStorage.getAllKeys();
        if (keys.includes(key)) {
            return await RNSecureStorage.getItem(key);
        }
        return "";
    },
    getSource: async () => {
        let source = await SecureStorage.getItem(Constants.source);
        return source == '' ? Sources.Anime1 : source;
    }
}

export default SecureStorage