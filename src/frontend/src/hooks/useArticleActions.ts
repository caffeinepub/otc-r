import { useGetCallerUserProfile, useSaveCallerUserProfile } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export function useArticleActions() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { mutate: saveProfile } = useSaveCallerUserProfile();
  const queryClient = useQueryClient();

  const toggleSaveArticle = (articleId: number) => {
    if (!profile || !identity) return;

    const savedArticles = Array.from(profile.savedArticles);
    const index = savedArticles.indexOf(articleId);

    if (index > -1) {
      savedArticles.splice(index, 1);
    } else {
      savedArticles.push(articleId);
    }

    saveProfile(
      {
        ...profile,
        savedArticles: new Uint32Array(savedArticles),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
        },
      }
    );
  };

  const addToReadingHistory = (articleId: number) => {
    if (!profile || !identity) return;

    const readingHistory = Array.from(profile.readingHistory);
    
    const index = readingHistory.indexOf(articleId);
    if (index > -1) {
      readingHistory.splice(index, 1);
    }
    
    readingHistory.unshift(articleId);
    
    const maxHistory = 50;
    if (readingHistory.length > maxHistory) {
      readingHistory.splice(maxHistory);
    }

    saveProfile(
      {
        ...profile,
        readingHistory: new Uint32Array(readingHistory),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['readingHistory'] });
        },
      }
    );
  };

  const isArticleSaved = (articleId: number): boolean => {
    if (!profile) return false;
    return Array.from(profile.savedArticles).includes(articleId);
  };

  return {
    toggleSaveArticle,
    addToReadingHistory,
    isArticleSaved,
  };
}
