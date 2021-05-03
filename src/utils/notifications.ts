import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

const configurePushNotifications = () => {
    PushNotification.configure({
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        onAction: function (notification) {
            console.log('ACTION:', notification.action);
            console.log('NOTIFICATION:', notification);
        },

        requestPermissions: Platform.OS === 'ios',
    });
};

interface INotifications {
    [key: string]: {
        notificationId: number;
        channelId: string;
    };
}

export const NOTIFICATIONS: INotifications = {
    SLOTS: { notificationId: 0, channelId: 'notification-slots' },
};

export const createNotificationChannel = () => {
    PushNotification.createChannel(
        {
            channelId: NOTIFICATIONS.SLOTS.channelId,
            channelName: 'Slots',
            channelDescription:
                'Notifications when a slot in your area is found.',
            playSound: false,
            soundName: 'default',
            importance: 4,
            vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`),
    );
};

export const sendSlotFoundNotification = (
    message: string,
    dateString: string,
) => {
    PushNotification.localNotification({
        /* Android Only Properties */
        channelId: NOTIFICATIONS.SLOTS.channelId,
        smallIcon: 'ic_notification',
        subText: dateString,
        color: 'blue',
        vibration: 300,
        visibility: 'public',
        ignoreInForeground: false,

        /* iOS and Android properties */
        id: NOTIFICATIONS.SLOTS.notificationId,
        message,
        title: 'Slots found!',
    });
};

export const initialisePushNotifications = () => {
    configurePushNotifications();
    createNotificationChannel();
};
