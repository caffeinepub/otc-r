import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Newspaper, Flame, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BottomTabs() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Rumors', path: '/rumors', icon: Flame },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <Button
                key={tab.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: tab.path })}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                <span className="text-xs">{tab.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
