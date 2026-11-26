import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DiatinfColors } from '@/constants/diatinf-theme';
import { DiatinfProvider } from '@/contexts/DiatinfContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <DiatinfProvider>
        <StatusBar style="light" />
        <View style={styles.outerShell}>
          <View style={styles.mobileFrame}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: DiatinfColors.cream },
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="post/[id]" />
              <Stack.Screen name="profile/[username]" />
              <Stack.Screen
                name="new-post"
                options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }}
              />
              <Stack.Screen
                name="login"
                options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }}
              />
            </Stack>
          </View>
        </View>
      </DiatinfProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? DiatinfColors.navyDeep : DiatinfColors.navy,
    alignItems: 'center',
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 460 : undefined,
    backgroundColor: DiatinfColors.cream,
    overflow: 'hidden',
  },
});
