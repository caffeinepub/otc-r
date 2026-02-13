import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetSavedArticles, useGetReadingHistory } from '../hooks/useQueries';
import { useThemeMode } from '../hooks/useThemeMode';
import LoginButton from '../components/profile/LoginButton';
import PromotionPicker from '../components/profile/PromotionPicker';
import ArticleCard from '../components/articles/ArticleCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: savedArticles = [] } = useGetSavedArticles();
  const { data: readingHistory = [] } = useGetReadingHistory();
  const { isDark, toggleTheme } = useThemeMode();

  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString();

  const copyPrincipalId = () => {
    if (principalId) {
      navigator.clipboard.writeText(principalId);
      toast.success('Principal ID copied to clipboard');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Sign in to access your profile and settings</p>
              <LoginButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12 text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <LoginButton />
        </div>

        {principalId && (
          <Card>
            <CardHeader>
              <CardTitle>Your Principal ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                  {principalId}
                </code>
                <Button variant="outline" size="icon" onClick={copyPrincipalId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Favorite Promotions</Label>
              <PromotionPicker />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  Dark Mode
                </Label>
                <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="breaking-alerts" className="cursor-pointer">
                  Breaking News Alerts
                </Label>
                <Switch id="breaking-alerts" checked={profile?.breakingNewsAlerts || false} disabled />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="rumor-alerts" className="cursor-pointer">
                  Rumor Alerts
                </Label>
                <Switch id="rumor-alerts" checked={profile?.rumorAlerts || false} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
            <TabsTrigger value="history">Reading History</TabsTrigger>
          </TabsList>
          <TabsContent value="saved" className="space-y-4 mt-6">
            {savedArticles.length > 0 ? (
              savedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No saved articles yet
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="history" className="space-y-4 mt-6">
            {readingHistory.length > 0 ? (
              readingHistory.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No reading history yet
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
