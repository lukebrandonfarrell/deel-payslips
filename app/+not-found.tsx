import { Link, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        backgroundColor="$background"
        paddingTop={insets.top}
        paddingBottom={insets.bottom}
        paddingLeft={insets.left}
        paddingRight={insets.right}
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
    </>
  );
}
