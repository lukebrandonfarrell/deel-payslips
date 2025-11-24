import React, { createContext, ReactNode, useContext } from 'react';
import { Payslip } from '../../types/payslip';

interface PayslipCardContextValue {
  payslip: Payslip;
  onPress?: () => void;
}

const PayslipCardContext = createContext<PayslipCardContextValue | null>(null);

interface PayslipCardProviderProps {
  payslip: Payslip;
  onPress?: () => void;
  children: ReactNode;
}

export function PayslipCardProvider({ payslip, onPress, children }: PayslipCardProviderProps) {
  return (
    <PayslipCardContext.Provider value={{ payslip, onPress }}>
      {children}
    </PayslipCardContext.Provider>
  );
}

export function usePayslipCardContext() {
  const context = useContext(PayslipCardContext);
  if (!context) {
    throw new Error('PayslipCard components must be used within PayslipCard.Provider');
  }
  return context;
}

