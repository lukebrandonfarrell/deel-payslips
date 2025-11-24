import React from 'react';
import { XStack } from 'tamagui';
import { useBadgeContext } from './BadgeProvider';

interface BadgeFrameProps {
  children: React.ReactNode;
}

const variantStyles = {
  default: { backgroundColor: '$blue9', borderColor: 'transparent' },
  secondary: { backgroundColor: '$gray5', borderColor: 'transparent' },
  destructive: { backgroundColor: '$red9', borderColor: 'transparent' },
  outline: { backgroundColor: 'transparent', borderColor: '$gray8' },
} as const;

export function BadgeFrame({ children, ...props }: BadgeFrameProps) {
  const { variant } = useBadgeContext();

  return (
    <XStack
      alignItems="center"
      borderRadius="$2"
      borderWidth={1}
      paddingHorizontal="$2.5"
      paddingVertical="$0.5"
      {...variantStyles[variant]}
      {...props}
    >
      {children}
    </XStack>
  );
}

