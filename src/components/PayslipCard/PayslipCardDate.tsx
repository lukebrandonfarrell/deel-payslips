import React from 'react';
import { Text } from 'tamagui';
import { formatDateRange } from '../../utils/dateFormatter';
import { usePayslipCardContext } from './PayslipCardProvider';

export function PayslipCardDate() {
  const { payslip } = usePayslipCardContext();

  return (
    <Text fontSize="$3" color="$color10">
      {formatDateRange(payslip.fromDate, payslip.toDate)}
    </Text>
  );
}

