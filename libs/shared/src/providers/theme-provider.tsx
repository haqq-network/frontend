import {
  ReactElement,
  ReactNode,
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import store from 'store2';

export interface ThemeService {
  theme: Theme;
  isDark: boolean;
  changeTheme: (newTheme: Theme) => void;
}

export const ThemeContext = createContext<ThemeService | undefined>(undefined);

export const enum Theme {
  light = 'light',
  dark = 'dark',
}

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? Theme.dark
  : Theme.light;

const savedTheme = store.get('theme') ?? systemTheme;

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [theme, setTheme] = useState<Theme>(savedTheme);

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
    if (theme === Theme.dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    store.set('theme', theme);
  }, [theme]);

  const themeService = useMemo(() => {
    return {
      theme,
      isDark: theme === Theme.dark,
      changeTheme: handleThemeChange,
    };
  }, [handleThemeChange, theme]);

  return (
    <ThemeContext.Provider value={themeService}>
      {children}
    </ThemeContext.Provider>
  );
}
