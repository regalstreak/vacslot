import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Home } from './src/Home';

const queryClient = new QueryClient();

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <PaperProvider>
                <Home />
            </PaperProvider>
        </QueryClientProvider>
    );
};
