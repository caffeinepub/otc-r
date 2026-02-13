import { useGetAllArticles, useSearchArticles } from '../hooks/useQueries';
import { useSearchContext } from '../components/layouts/TabShell';
import BreakingBanner from '../components/home/BreakingBanner';
import ArticleCard from '../components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ArticleCategory } from '../backend';

export default function HomePage() {
  const { searchQuery } = useSearchContext();
  const { data: articles = [], isLoading, refetch, isFetching } = useGetAllArticles();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchArticles(searchQuery);

  const isSearching = searchQuery.trim().length > 0;
  const displayArticles = isSearching ? searchResults : articles;

  const newsArticles = displayArticles.filter((a) => a.category === ArticleCategory.news);
  const rumorArticles = displayArticles.filter((a) => a.category === ArticleCategory.rumors);
  const eventArticles = displayArticles.filter((a) => a.category === ArticleCategory.events);

  const breakingNews = newsArticles.slice(0, 3);
  const latestArticles = newsArticles.slice(0, 10);
  const trendingStories = newsArticles.slice(0, 3);
  const latestRumors = rumorArticles.slice(0, 3);
  const upcomingEvent = eventArticles[0];

  const showEmptyState = !isLoading && !isSearching && articles.length === 0;
  const showSearchResults = isSearching;
  const showNoSearchResults = isSearching && !searchLoading && searchResults.length === 0;

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {showSearchResults ? `Search: "${searchQuery}"` : 'Home'}
          </h1>
          {!isSearching && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>

        {(isLoading || searchLoading) ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : showNoSearchResults ? (
          <div className="text-center py-12 text-muted-foreground">
            No articles found matching "{searchQuery}"
          </div>
        ) : showSearchResults ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : showEmptyState ? (
          <div className="text-center py-12 text-muted-foreground">
            No articles available yet. Check back soon!
          </div>
        ) : (
          <>
            {breakingNews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Breaking News</h2>
                <BreakingBanner articles={breakingNews} />
              </section>
            )}

            {latestArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {trendingStories.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Trending Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trendingStories.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {latestRumors.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Latest Rumors</h2>
                <div className="space-y-4">
                  {latestRumors.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {upcomingEvent && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Upcoming Event</h2>
                <ArticleCard article={upcomingEvent} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
