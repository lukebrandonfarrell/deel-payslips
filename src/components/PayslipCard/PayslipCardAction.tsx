import React from 'react';
import { Text } from 'tamagui';

interface PayslipCardActionProps {
  icon?: string;
  color?: string;
}

export function PayslipCardAction({ icon = '→', color = '$yellow10' }: PayslipCardActionProps) {
  return (
    <Text color={color} fontSize="$5">
      {icon}
    </Text>
  );
}

