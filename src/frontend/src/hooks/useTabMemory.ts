import { useEffect } from 'react';

const tabMemory: Record<string, string> = {};

export function useTabMemory(tabName: string, currentPath: string) {
  useEffect(() => {
    tabMemory[tabName] = currentPath;
  }, [tabName, currentPath]);

  return {
    getLastPath: (tab: string) => tabMemory[tab] || getDefaultPath(tab),
  };
}

function getDefaultPath(tab: string): string {
  switch (tab) {
    case 'home':
      return '/';
    case 'news':
      return '/news';
    case 'rumors':
      return '/rumors';
    case 'events':
      return '/events';
    case 'profile':
      return '/profile';
    default:
      return '/';
  }
}
