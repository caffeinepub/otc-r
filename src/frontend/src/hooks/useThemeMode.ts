import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';

export function useThemeMode() {
  const { theme, setTheme } = useTheme();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { mutate: saveProfile } = useSaveCallerUserProfile();

  useEffect(() => {
    if (profile && identity) {
      const preferredTheme = profile.darkMode ? 'dark' : 'light';
      if (theme !== preferredTheme) {
        setTheme(preferredTheme);
      }
    }
  }, [profile, identity, theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (profile && identity) {
      saveProfile({
        ...profile,
        darkMode: newTheme === 'dark',
      });
    } else {
      localStorage.setItem('theme-preference', newTheme);
    }
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
