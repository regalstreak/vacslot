import React, { useEffect, useMemo, useState } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import {
    DarkTheme,
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { colors } from './constants/colors';
import { Home } from './screens/Home';
import { setNotificationStore } from './utils/asyncStorageUtils';
import RNDisableBatteryOptimizationsAndroid from '@brandonhenao/react-native-disable-battery-optimizations-android';
import { BatteryOptimisationModal } from './components/BatteryOptimisationModal';
import CodePush from 'react-native-code-push';
import { Appearance } from 'react-native';

const queryClient = new QueryClient();

const App = () => {
    const [
        isBatteryOptimisationModalVisible,
        setIsBatteryOptimisationModalVisible,
    ] = useState(false);

    useEffect(() => {
        const initBackgroundFetch = async () => {
            try {
                const onEvent = async (taskId: string) => {
                    console.log('[BackgroundFetch] task: ', taskId);
                    BackgroundFetch.finish(taskId);
                };

                const onTimeout = async (taskId: string) => {
                    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
                    BackgroundFetch.finish(taskId);
                };

                setNotificationStore({
                    notified: false,
                });

                const backgroundFetchStatus = await BackgroundFetch.configure(
                    {
                        minimumFetchInterval: 1,
                        enableHeadless: true,
                        startOnBoot: true,
                        stopOnTerminate: false,
                    },
                    onEvent,
                    onTimeout,
                );

                console.log(
                    '[BackgroundFetch] configure status: ',
                    backgroundFetchStatus,
                );
            } catch (error) {
                console.log(error);
            }
        };

        initBackgroundFetch();
    }, []);

    useEffect(() => {
        RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
            (isEnabled: boolean) => {
                if (isEnabled) {
                    setIsBatteryOptimisationModalVisible(true);
                }
            },
        );
    }, []);

    const theme = useMemo(() => {
        const devicetheme = Appearance.getColorScheme();
        const themeToExtend = devicetheme === 'dark' ? DarkTheme : DefaultTheme;

        return {
            ...themeToExtend,
            roundness: 2,
            colors: {
                ...themeToExtend.colors,
                primary: colors.secondary,
                accent: colors.secondary,
            },
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider theme={theme}>
                <BatteryOptimisationModal
                    modalVisible={isBatteryOptimisationModalVisible}
                    setModalVisible={setIsBatteryOptimisationModalVisible}
                />
                <Home />
            </PaperProvider>
        </QueryClientProvider>
    );
};

export default CodePush(App);
