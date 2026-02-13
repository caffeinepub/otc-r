import { useGetArticlesByCategory, useSearchArticles } from '../hooks/useQueries';
import { useSearchContext } from '../components/layouts/TabShell';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleCategory } from '../backend';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const { searchQuery } = useSearchContext();
  const { data: articles = [], isLoading } = useGetArticlesByCategory(ArticleCategory.events);
  const { data: searchResults = [], isLoading: searchLoading } = useSearchArticles(searchQuery);
  const navigate = useNavigate();

  const isSearching = searchQuery.trim().length > 0;
  const displayArticles = isSearching ? searchResults : articles;
  const eventArticles = displayArticles.filter((a) => a.category === ArticleCategory.events);

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">
          {isSearching ? `Search: "${searchQuery}"` : 'Events'}
        </h1>

        {(isLoading || searchLoading) ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventArticles.length > 0 ? (
              eventArticles.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate({ to: `/events/${event.id}` })}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {event.summary}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {isSearching 
                  ? `No events found matching "${searchQuery}"`
                  : 'No events available'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
