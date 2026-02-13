import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function MatchDetailPage() {
  const { eventId, matchId } = useParams({ from: '/events/$eventId/match/$matchId' });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/events/${eventId}` })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Match ID: {matchId}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
