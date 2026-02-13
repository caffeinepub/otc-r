import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllArticles } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/events/$eventId' });
  const { data: articles = [] } = useGetAllArticles();
  const navigate = useNavigate();

  const event = articles.find((a) => a.id === Number(eventId));

  if (!event) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate({ to: '/events' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <div className="text-center py-12 text-muted-foreground">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/events' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{event.summary}</CardTitle>
            <p className="text-muted-foreground">
              {new Date(Number(event.publishDate) / 1000000).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{event.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
