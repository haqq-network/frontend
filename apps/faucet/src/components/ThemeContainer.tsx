import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

export const enum Theme {
  light = 'light',
  dark = 'dark',
}

const userSystemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  .matches
  ? Theme.dark
  : Theme.light;

interface ThemeHook {
  theme: Theme;
  isDark: boolean;
  changeTheme: (newTheme: Theme) => void;
}

export const ThemeContext = createContext<ThemeHook | undefined>(undefined);

export function ThemeContainer({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [theme, setTheme] = useState<Theme>(userSystemTheme);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const handleUserThemeChange = useCallback((event: MediaQueryListEvent) => {
    setTheme(event.matches ? Theme.dark : Theme.light);
  }, []);

  // Subscribe to user theme change
  useEffect(() => {
    const userTheme = window.matchMedia('(prefers-color-scheme: dark)');

    userTheme.addEventListener('change', handleUserThemeChange);
    return () => {
      userTheme.removeEventListener('change', handleUserThemeChange);
    };
  }, [handleUserThemeChange]);

  // Change body class name on theme change
  useEffect(() => {
    const { body } = document;

    if (theme === Theme.dark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [theme]);

  const memoizedHook = useMemo(() => {
    return {
      theme,
      isDark: theme === Theme.dark,
      changeTheme: handleThemeChange,
    };
  }, [handleThemeChange, theme]);

  return (
    <ThemeContext.Provider value={memoizedHook}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeHook {
  const themeService = useContext(ThemeContext);

  if (themeService === undefined) {
    throw new Error('useTheme must be used within a ThemeContext');
  }

  return themeService;
}
