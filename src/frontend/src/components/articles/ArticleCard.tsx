import { useNavigate } from '@tanstack/react-router';
import { Article, ArticleCategory } from '../../backend';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PromotionBadge from '../promotions/PromotionBadge';

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const navigate = useNavigate();

  const isBreaking = article.category === ArticleCategory.news;

  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate({ to: '/article/$articleId', params: { articleId: String(article.id) } })}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {isBreaking && (
              <Badge variant="destructive" className="mb-2 text-breaking bg-breaking/20 border-breaking">
                BREAKING
              </Badge>
            )}
            <CardTitle className={compact ? 'text-lg' : 'text-xl'}>
              {article.summary || 'Article'}
            </CardTitle>
            <CardDescription className="mt-2">
              {new Date(Number(article.publishDate) / 1000000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          <PromotionBadge promotion={article.promotion} />
        </div>
      </CardHeader>
      {!compact && article.content && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
        </CardContent>
      )}
    </Card>
  );
}
