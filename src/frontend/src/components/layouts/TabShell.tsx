import { ReactNode, createContext, useContext, useState } from 'react';
import AppHeader from '../branding/AppHeader';
import BottomTabs from '../navigation/BottomTabs';

interface TabShellProps {
  children: ReactNode;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within TabShell');
  }
  return context;
}

export default function TabShell({ children }: TabShellProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="pb-16">{children}</main>
        <BottomTabs />
      </div>
    </SearchContext.Provider>
  );
}
