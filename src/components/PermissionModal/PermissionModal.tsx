import { Button } from '@tamagui/button';
import { Dialog } from '@tamagui/dialog';
import React from 'react';
import { Text, YStack } from 'tamagui';

interface PermissionModalProps {
  open: boolean;
  onClose: () => void;
  onRequestPermission: () => Promise<void>;
  title: string;
  description: string;
  requestButtonText?: string;
  cancelButtonText?: string;
}

export function PermissionModal({
  open,
  onClose,
  onRequestPermission,
  title,
  description,
  requestButtonText = 'Request Permissions',
  cancelButtonText = 'Cancel',
}: PermissionModalProps) {
  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      await onRequestPermission();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          maxWidth={400}
          padding="$4"
          backgroundColor="$background"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <YStack gap="$4">
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="600">
                {title}
              </Text>
              <Text fontSize="$4" color="$color10" lineHeight="$1">
                {description}
              </Text>
            </YStack>

            <YStack gap="$3" marginTop="$2">
              <Button
                theme="yellow"
                onPress={handleRequestPermission}
                disabled={isRequesting}
                width="100%"
              >
                {isRequesting ? 'Requesting...' : requestButtonText}
              </Button>
              <Button
                theme="gray"
                variant="outlined"
                onPress={onClose}
                disabled={isRequesting}
                width="100%"
              >
                {cancelButtonText}
              </Button>
            </YStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

