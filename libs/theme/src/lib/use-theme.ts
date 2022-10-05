import { useContext } from 'react';
import { ThemeContext, ThemeService } from './theme-provider';

export function useTheme(): ThemeService {
  const themeService = useContext(ThemeContext);

  if (themeService === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return themeService;
}
