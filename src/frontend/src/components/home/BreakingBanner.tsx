import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Article } from '../../backend';
import { Badge } from '@/components/ui/badge';

interface BreakingBannerProps {
  articles: Article[];
}

export default function BreakingBanner({ articles }: BreakingBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div
      className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
      onClick={() => navigate({ to: '/article/$articleId', params: { articleId: String(currentArticle.id) } })}
      style={{
        backgroundImage: 'url(/assets/generated/breaking-banner-bg.dim_1600x400.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <Badge variant="destructive" className="w-fit mb-3 text-breaking bg-breaking/20 border-breaking">
          BREAKING NEWS
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-breaking transition-colors">
          {currentArticle.summary || 'Breaking News'}
        </h2>
        {articles.length > 1 && (
          <div className="flex gap-2 mt-4">
            {articles.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-breaking' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
