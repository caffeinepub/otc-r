import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchContext } from '../layouts/TabShell';

export default function AppHeader() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearchContext();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalQuery(value);
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleUploadClick = () => {
    navigate({ to: '/upload' });
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/assets/generated/otc-r-logo.dim_512x512.png"
            alt="OTC-R Logo"
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-bold tracking-tight hidden sm:block">OTC-R</h1>
        </div>

        <div className="flex-1 flex items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={localQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {localQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleUploadClick}
            size="sm"
            className="flex-shrink-0"
          >
            <Upload className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
