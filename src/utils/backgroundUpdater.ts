import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import { sendLocalNotification } from './notifications';

const backgroundUpdaterTask = async ({ taskId, timeout }: HeadlessEvent) => {
    if (timeout) {
        console.log('[BackgroundFetch] HeadlessTask TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
        return;
    }

    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);

    let response = await fetch(
        'https://facebook.github.io/react-native/movies.json',
    );
    let responseJson = await response.json();
    console.log('[BackgroundFetch HeadlessTask] response: ', responseJson);
    sendLocalNotification(taskId);

    BackgroundFetch.finish(taskId);
};

export const registerBackgroundFetchHeadlessTasks = () => {
    BackgroundFetch.registerHeadlessTask(backgroundUpdaterTask);
};
