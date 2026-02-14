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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, CheckCircle2, Upload, Globe, X } from 'lucide-react';
import LoginButton from '../components/profile/LoginButton';
import { convertImageToDataUrl } from '../utils/imageDataUrl';
import { normalizeErrorMessage } from '../utils/errorMessage';

export default function UploadSubmissionPage() {
  const { identity } = useInternetIdentity();
  const uploadMutation = useUploadArticle();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrl: '',
    content: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [urlPreviewUrl, setUrlPreviewUrl] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [published, setPublished] = useState(false);
  const [backendError, setBackendError] = useState<string>('');

  const isAuthenticated = !!identity;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError('');
    setBackendError('');

    if (!file) {
      setSelectedFile(null);
      setFilePreviewUrl('');
      return;
    }

    try {
      // Validate and convert to data URL
      const dataUrl = await convertImageToDataUrl(file);
      setSelectedFile(file);
      setFilePreviewUrl(dataUrl);
      // Clear URL input when file is selected
      setFormData({ ...formData, imageUrl: '' });
      setUrlPreviewUrl('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to process image');
      setSelectedFile(null);
      setFilePreviewUrl('');
      // Reset file input
      e.target.value = '';
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setValidationError('');
    setBackendError('');
    
    // Clear file selection when URL is entered
    if (url.trim()) {
      setSelectedFile(null);
      setFilePreviewUrl('');
      // Update URL preview
      setUrlPreviewUrl(url);
    } else {
      setUrlPreviewUrl('');
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setFilePreviewUrl('');
    setValidationError('');
    setBackendError('');
    // Reset file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setBackendError('');

    if (!identity) {
      return;
    }

    // Validate that either a file or URL is provided
    if (!selectedFile && !formData.imageUrl.trim()) {
      setValidationError('Please provide an image by selecting a file or entering a URL');
      return;
    }

    if (!formData.content.trim()) {
      setValidationError('Please enter your content');
      return;
    }

    // Only proceed if immediate publish is selected
    if (!publishImmediately) {
      return;
    }

    try {
      // Determine the image URL to use
      let imageUrl = formData.imageUrl;
      
      if (selectedFile) {
        // Convert selected file to data URL for storage
        imageUrl = await convertImageToDataUrl(selectedFile);
      }

      const article = {
        id: Math.floor(Math.random() * 1000000),
        promotion: 'User Submission',
        category: ArticleCategory.news,
        publishDate: BigInt(Date.now()) * BigInt(1000000),
        imageUrl: imageUrl,
        summary: formData.content.substring(0, 150),
        content: formData.content,
      };

      // Use mutateAsync to properly handle success/error
      await uploadMutation.mutateAsync(article);
      
      // Only set published state after successful mutation
      setPublished(true);
      
      // Reset all form state
      setFormData({
        imageUrl: '',
        content: '',
      });
      setSelectedFile(null);
      setFilePreviewUrl('');
      setUrlPreviewUrl('');
      setValidationError('');
      setBackendError('');
      setPublishImmediately(true);
      
      // Reset file input
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      // Handle backend errors
      const errorMsg = normalizeErrorMessage(error);
      setBackendError(errorMsg);
      // Don't set published state on error
    }
  };

  const handlePublishAnother = () => {
    setPublished(false);
    setPublishImmediately(true);
    setBackendError('');
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
                Your content is now publicly visible immediately in the Home and News feeds. No approval required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handlePublishAnother}>
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

  const previewImageUrl = filePreviewUrl || urlPreviewUrl;

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
              Share your wrestling news, photos, or updates with the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Selection Section */}
              <div className="space-y-4">
                <Label>Photo *</Label>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                      disabled={uploadMutation.isPending}
                    />
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearFileSelection}
                        disabled={uploadMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select an image from your device (max 2MB)
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    disabled={uploadMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a link to an image hosted online
                  </p>
                </div>

                {/* Image Preview */}
                {previewImageUrl && (
                  <div className="rounded-lg border p-2">
                    <p className="text-xs font-medium mb-2 text-muted-foreground">Preview:</p>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                      <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={() => {
                          if (urlPreviewUrl) {
                            setUrlPreviewUrl('');
                            setValidationError('Failed to load image from URL. Please check the URL and try again.');
                          }
                        }}
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your wrestling news, updates, or insights..."
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value });
                    setValidationError('');
                    setBackendError('');
                  }}
                  rows={10}
                  disabled={uploadMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Write your article, news update, or commentary
                </p>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="publishImmediately"
                    checked={publishImmediately}
                    onCheckedChange={(checked) => setPublishImmediately(checked === true)}
                    className="mt-1"
                    disabled={uploadMutation.isPending}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="publishImmediately"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Publish publicly immediately (no approval required)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Your content will be visible to everyone in Home and News feeds right away
                    </p>
                  </div>
                </div>
              </div>

              {validationError && (
                <Alert variant="destructive">
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {backendError && (
                <Alert variant="destructive">
                  <AlertDescription>{backendError}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending || !publishImmediately}
                  className="flex-1"
                >
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
