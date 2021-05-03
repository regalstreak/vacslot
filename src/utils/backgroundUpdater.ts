import { fetchSlots } from './../hooks/useSlots';
import {
    AsyncStorageKeys,
    getAsyncStorageItem,
    INotificationStore,
    ISettingsStore,
    setNotificationStore,
} from './asyncStorageUtils';
import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { sendSlotFoundNotification } from './notifications';

const backgroundUpdaterTask = async ({ taskId, timeout }: HeadlessEvent) => {
    if (timeout) {
        console.log('[BackgroundFetch] HeadlessTask TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
        return;
    }

    const notificationStore: INotificationStore = await getAsyncStorageItem(
        AsyncStorageKeys.NOTIFICATION,
    );
    const settingsStore: ISettingsStore = await getAsyncStorageItem(
        AsyncStorageKeys.SETTINGS,
    );

    if (
        notificationStore.notified === true ||
        !settingsStore.notificationsEnabled
    ) {
        BackgroundFetch.finish(taskId);
        return;
    }

    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

    const settings: ISettingsStore = await getAsyncStorageItem(
        AsyncStorageKeys.SETTINGS,
    );

    const slots = await fetchSlots({
        districtId: settings?.district?.id,
        hideAbove45: settings?.hideAbove45,
    });

    if (slots.centers.length > 0) {
        const lastChecked = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        const numberOfSlots = slots.centers.reduce(
            (accumulator, currentValue) => {
                return accumulator + currentValue.sessions.length;
            },
            0,
        );
        const message = `Found ${numberOfSlots} slots for ${settings.district?.value}`;
        sendSlotFoundNotification(message, lastChecked);
        setNotificationStore({ notified: true, lastChecked });
    }

    BackgroundFetch.finish(taskId);
};

export const registerBackgroundFetchHeadlessTasks = () => {
    BackgroundFetch.registerHeadlessTask(backgroundUpdaterTask);
};
