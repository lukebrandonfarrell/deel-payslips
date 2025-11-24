import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { Text, YStack } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={{ flex: 1 }}>
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          padding="$4"
          backgroundColor="$background"
        >
          <Text fontSize="$6" fontWeight="600" marginBottom="$4">
            This screen doesn't exist.
          </Text>

          <Link href="/">
            <YStack marginTop="$4" paddingVertical="$4">
              <Text fontSize="$4" color="$blue10">
                Go to home screen!
              </Text>
            </YStack>
          </Link>
        </YStack>
      </SafeAreaView>
    </>
  );
}
