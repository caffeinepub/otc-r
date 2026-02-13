import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import TabShell from './components/layouts/TabShell';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import RumorsPage from './pages/RumorsPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import MatchDetailPage from './pages/MatchDetailPage';
import UploadSubmissionPage from './pages/UploadSubmissionPage';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TabShell>
        <Outlet />
      </TabShell>
      <Toaster />
    </ThemeProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
});

const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/article/$articleId',
  component: ArticleDetailPage,
});

const rumorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rumors',
  component: RumorsPage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetailPage,
});

const matchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId/match/$matchId',
  component: MatchDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadSubmissionPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  newsRoute,
  articleDetailRoute,
  rumorsRoute,
  eventsRoute,
  eventDetailRoute,
  matchDetailRoute,
  profileRoute,
  uploadRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
