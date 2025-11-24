import React from 'react';
import { Text } from 'tamagui';
import { useBadgeContext } from './BadgeProvider';

interface BadgeLabelProps {
  children: React.ReactNode;
}

const textColors = {
  default: '$yellow1',
  secondary: '$gray11',
  destructive: '$red1',
  outline: '$gray11',
} as const;

export function BadgeLabel({ children }: BadgeLabelProps) {
  const { variant } = useBadgeContext();

  return (
    <Text fontSize="$1" fontWeight="600" color={textColors[variant]}>
      {children}
    </Text>
  );
}

