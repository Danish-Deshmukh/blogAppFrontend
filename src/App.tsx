import {StatusBar} from 'react-native';
import React from 'react';
import Navigation from './Navigation';
import {AuthProvider} from './context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <PaperProvider>
          <AuthProvider>
            <StatusBar />
            <Navigation />
          </AuthProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
