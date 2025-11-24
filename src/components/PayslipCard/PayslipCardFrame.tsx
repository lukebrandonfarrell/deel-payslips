import { Card } from '@tamagui/card';
import React from 'react';
import { usePayslipCardContext } from './PayslipCardProvider';

interface PayslipCardFrameProps {
  children: React.ReactNode;
}

export function PayslipCardFrame({ children }: PayslipCardFrameProps) {
  const { onPress } = usePayslipCardContext();

  return (
    <Card
      marginBottom="$3"
      opacity={0.7}
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={onPress}
    >
      {children}
    </Card>
  );
}

