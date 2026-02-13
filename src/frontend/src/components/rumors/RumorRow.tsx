import { Article } from '../../backend';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatusPill from './StatusPill';
import PromotionBadge from '../promotions/PromotionBadge';

interface RumorRowProps {
  article: Article;
}

export default function RumorRow({ article }: RumorRowProps) {
  const status = extractStatus(article.content);
  const source = extractSource(article.content);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StatusPill status={status} />
              <PromotionBadge promotion={article.promotion} />
            </div>
            <CardTitle className="text-lg">{article.summary}</CardTitle>
            {source && (
              <CardDescription className="mt-2">
                Source: {source}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function extractStatus(content: string): 'confirmed' | 'likely' | 'false' {
  const lower = content.toLowerCase();
  if (lower.includes('confirmed')) return 'confirmed';
  if (lower.includes('false') || lower.includes('denied')) return 'false';
  return 'likely';
}

function extractSource(content: string): string | null {
  const match = content.match(/source:\s*(.+?)(?:\n|$)/i);
  return match ? match[1].trim() : null;
}
