'use client';
import { createContext, useContext, ReactNode } from 'react';

// Define types for feature flags
export interface FeatureFlags {
  LIQUID_STAKING: boolean;
}

// Define context type
export type FeatureFlagsContextType = {
  flags: FeatureFlags;
};

// Create context with initial empty state
const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(
  undefined,
);

// Props interface for provider
interface FeatureFlagsProviderProps {
  children: ReactNode;
  featureFlags: FeatureFlags;
}

// Provider component
export function FeatureFlagsProvider({
  children,
  featureFlags,
}: FeatureFlagsProviderProps) {
  return (
    <FeatureFlagsContext.Provider value={{ flags: featureFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Custom hook for accessing feature flags
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const context = useContext(FeatureFlagsContext);

  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within FeatureFlagsProvider');
  }

  return context.flags[flagName] ?? false;
}
