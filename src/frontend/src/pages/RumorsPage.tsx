import { useGetArticlesByCategory, useSearchArticles } from '../hooks/useQueries';
import { useSearchContext } from '../components/layouts/TabShell';
import RumorRow from '../components/rumors/RumorRow';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ArticleCategory } from '../backend';

export default function RumorsPage() {
  const { searchQuery } = useSearchContext();
  const { data: articles = [], isLoading, refetch, isFetching } = useGetArticlesByCategory(ArticleCategory.rumors);
  const { data: searchResults = [], isLoading: searchLoading } = useSearchArticles(searchQuery);

  const isSearching = searchQuery.trim().length > 0;
  const displayArticles = isSearching ? searchResults : articles;
  const rumorArticles = displayArticles.filter((a) => a.category === ArticleCategory.rumors);

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {isSearching ? `Search: "${searchQuery}"` : 'Rumors'}
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
        ) : (
          <div className="space-y-4">
            {rumorArticles.length > 0 ? (
              rumorArticles.map((article) => (
                <RumorRow key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {isSearching 
                  ? `No rumors found matching "${searchQuery}"`
                  : 'No rumors available'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
