import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllArticles } from '../hooks/useQueries';
import { useArticleActions } from '../hooks/useArticleActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import PromotionBadge from '../components/promotions/PromotionBadge';

export default function ArticleDetailPage() {
  const { articleId } = useParams({ from: '/article/$articleId' });
  const { data: articles = [] } = useGetAllArticles();
  const { isArticleSaved, toggleSaveArticle, addToReadingHistory } = useArticleActions();
  const navigate = useNavigate();

  const article = articles.find((a) => a.id === Number(articleId));

  if (!article) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center py-12 text-muted-foreground">Article not found</div>
        </div>
      </div>
    );
  }

  addToReadingHistory(article.id);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const saved = isArticleSaved(article.id);

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardContent className="p-0">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.summary}
                className="w-full h-64 md:h-96 object-cover rounded-t-lg"
              />
            )}

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <PromotionBadge promotion={article.promotion} size="sm" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(Number(article.publishDate) / 1000000).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{article.summary}</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={saved ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => toggleSaveArticle(article.id)}
                  >
                    {saved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{article.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
