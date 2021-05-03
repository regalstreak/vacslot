import AsyncStorage from '@react-native-async-storage/async-storage';

export enum AsyncStorageKeys {
    SETTINGS = '@Settings',
}

export const getAsyncStorageItem = async (
    key: AsyncStorageKeys,
): Promise<any> => {
    try {
        const value = await AsyncStorage.getItem(key.valueOf());
        if (!value) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (w) {
            // Value can't be parsed, is a string
            return value;
        }
    } catch (error) {
        return undefined;
    }
};

export const setAsyncStorageItem = async (
    key: AsyncStorageKeys,
    value: any,
    callback?: (error?: Error) => void,
): Promise<void> => {
    try {
        if (typeof value === 'string') {
            await AsyncStorage.setItem(key.valueOf(), value, callback);
            return;
        }
        await AsyncStorage.setItem(
            key.valueOf(),
            JSON.stringify(value),
            callback,
        );
    } catch (error) {
        // Do nothing
    }
};

export const removeAsyncStorageItem = async (
    key: AsyncStorageKeys,
): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key.valueOf());
    } catch (error) {
        // Do nothing
    }
};
