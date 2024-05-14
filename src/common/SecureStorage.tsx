import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

const SecureStorage = {
    setItem: async (key, value) => await RNSecureStorage.setItem(key, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED }),
    getItem: async (key) => await RNSecureStorage.getItem(key)
}

export default SecureStorage