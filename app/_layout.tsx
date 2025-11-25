import { useColorScheme } from '@/src/hooks/useColorScheme/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { DialogProvider } from '@tamagui/dialog';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <TamaguiProvider config={config} defaultTheme={isDark ? 'dark' : 'light'}>
          <PortalProvider shouldAddRootHost>
            <DialogProvider>
              <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="index" options={{ title: 'Payslips', headerBackTitle: "Back" }} />
                  <Stack.Screen name="[id]/detail" options={{ title: 'Payslip Details', headerBackTitle: "Back" }} />
                  <Stack.Screen name="[id]/preview" options={{ title: 'Payslip Preview', headerBackTitle: "Back" }} />
                </Stack>
              </ThemeProvider>
            </DialogProvider>
          </PortalProvider>
        </TamaguiProvider>
      </QueryClientProvider>
  );
}
