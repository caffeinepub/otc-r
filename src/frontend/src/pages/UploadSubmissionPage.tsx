import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUploadArticle } from '../hooks/useQueries';
import { ArticleCategory } from '../backend';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, CheckCircle2, Upload } from 'lucide-react';
import LoginButton from '../components/profile/LoginButton';

export default function UploadSubmissionPage() {
  const { identity } = useInternetIdentity();
  const uploadMutation = useUploadArticle();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrl: '',
    content: '',
  });

  const [published, setPublished] = useState(false);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl || !formData.content || !identity) {
      return;
    }

    const article = {
      id: Math.floor(Math.random() * 1000000),
      promotion: 'User Submission',
      category: ArticleCategory.news,
      publishDate: BigInt(Date.now()) * BigInt(1000000),
      imageUrl: formData.imageUrl,
      summary: formData.content.substring(0, 150),
      content: formData.content,
    };

    uploadMutation.mutate(article, {
      onSuccess: () => {
        setPublished(true);
        setFormData({
          imageUrl: '',
          content: '',
        });
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Sign In to Upload</h2>
              <p className="text-muted-foreground mb-4">
                You must be signed in to publish content
              </p>
              <LoginButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (published) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Published Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your content has been published and is now visible in the Home and News feeds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setPublished(false)}>
                  Publish Another
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Publish Content</CardTitle>
            <CardDescription>
              Share your wrestling news, photos, or updates. Your content will be published immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Photo URL *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Provide a link to an image hosted online
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your wrestling news, updates, or insights..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Write your article, news update, or commentary
                </p>
              </div>

              {uploadMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to publish content. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={uploadMutation.isPending} className="flex-1">
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Publish Now
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
