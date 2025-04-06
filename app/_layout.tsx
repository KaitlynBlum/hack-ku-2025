import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
      <Stack
  screenOptions={{
    headerStyle: {
      backgroundColor: '#0f0f0f', // Match your dark background
    },
    headerTintColor: '#00ffd5', // Optional: matches your neon text
    headerTitleStyle: {
      fontFamily: 'SpaceMono',
      fontWeight: 'bold',
    },
  }}
>
  <Stack.Screen name="landing" options={{ headerShown: false }} />
  <Stack.Screen name="index" options={{ title: 'Home' }} />
  <Stack.Screen name="add" options={{ title: 'Add Item' }} />
  <Stack.Screen name="search" options={{ title: 'Search Items' }} />
  <Stack.Screen name="view-all" options={{ title: 'All Items' }} />
  <Stack.Screen name="+not-found" />
</Stack>


        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
