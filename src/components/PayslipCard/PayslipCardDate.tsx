import React from 'react';
import { Text } from 'tamagui';
import { formatDateRange } from '../../services/dateServices/dateServices';
import { usePayslipCardContext } from './PayslipCardProvider';

export function PayslipCardDate() {
  const { payslip } = usePayslipCardContext();

  return (
    <Text fontSize="$3" color="$color10">
      {formatDateRange(payslip.fromDate, payslip.toDate)}
    </Text>
  );
}

