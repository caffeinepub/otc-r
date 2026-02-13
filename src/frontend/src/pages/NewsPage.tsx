import { useState } from 'react';
import { useGetArticlesByPromotionAndCategory, useSearchArticles } from '../hooks/useQueries';
import { useSearchContext } from '../components/layouts/TabShell';
import ArticleCard from '../components/articles/ArticleCard';
import NewsFilters from '../components/news/NewsFilters';
import { ArticleCategory } from '../backend';

export default function NewsPage() {
  const { searchQuery } = useSearchContext();
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const category = selectedCategory as ArticleCategory | null;
  const { data: articles = [], isLoading } = useGetArticlesByPromotionAndCategory(
    selectedPromotion,
    category
  );
  const { data: searchResults = [], isLoading: searchLoading } = useSearchArticles(searchQuery);

  const isSearching = searchQuery.trim().length > 0;
  const displayArticles = isSearching ? searchResults : articles;
  const newsArticles = displayArticles.filter((a) => a.category === ArticleCategory.news);

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold">
          {isSearching ? `Search: "${searchQuery}"` : 'News'}
        </h1>

        {!isSearching && (
          <NewsFilters
            selectedPromotion={selectedPromotion}
            selectedCategory={selectedCategory}
            onPromotionChange={setSelectedPromotion}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {(isLoading || searchLoading) ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            {newsArticles.length > 0 ? (
              newsArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {isSearching 
                  ? `No news articles found matching "${searchQuery}"`
                  : 'No news articles found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
