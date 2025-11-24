import React, { createContext, ReactNode, useContext } from 'react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeContextValue {
  variant: BadgeVariant;
}

const BadgeContext = createContext<BadgeContextValue | null>(null);

interface BadgeProviderProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function BadgeProvider({ variant = 'default', children }: BadgeProviderProps) {
  return (
    <BadgeContext.Provider value={{ variant }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadgeContext() {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('Badge components must be used within Badge.Provider');
  }
  return context;
}

