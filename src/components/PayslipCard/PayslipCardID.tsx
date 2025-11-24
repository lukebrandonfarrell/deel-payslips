import React from 'react';
import { Text } from 'tamagui';
import { usePayslipCardContext } from './PayslipCardProvider';

interface PayslipCardIDProps {
  prefix?: string;
}

export function PayslipCardID({ prefix = 'Payslip #' }: PayslipCardIDProps) {
  const { payslip } = usePayslipCardContext();

  return (
    <Text fontSize="$4" fontWeight="600" marginBottom="$1">
      {prefix}{payslip.id}
    </Text>
  );
}

