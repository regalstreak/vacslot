import React, { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Home } from './screens/Home';

const queryClient = new QueryClient();

export const App = () => {
    useEffect(() => {
        const initBackgroundFetch = async () => {
            const onEvent = async (taskId: string) => {
                console.log('[BackgroundFetch] task: ', taskId);
                BackgroundFetch.finish(taskId);
            };

            const onTimeout = async (taskId: string) => {
                console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
                BackgroundFetch.finish(taskId);
            };

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
        };

        initBackgroundFetch();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider>
                <Home />
            </PaperProvider>
        </QueryClientProvider>
    );
};
