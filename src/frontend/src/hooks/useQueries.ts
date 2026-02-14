import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Article, ArticleCategory, UserProfile } from '../backend';
import { toast } from 'sonner';
import { normalizeErrorMessage } from '../utils/errorMessage';

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticlesByPromotion(promotion: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', 'promotion', promotion],
    queryFn: async () => {
      if (!actor) return [];
      if (!promotion) return actor.getAllArticles();
      return actor.getArticlesByPromotion(promotion);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticlesByCategory(category: ArticleCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) return actor.getAllArticles();
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticlesByPromotionAndCategory(promotion: string | null, category: ArticleCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', 'promotion', promotion, 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      if (!promotion && !category) return actor.getAllArticles();
      if (!promotion && category) return actor.getArticlesByCategory(category);
      if (promotion && !category) return actor.getArticlesByPromotion(promotion);
      return actor.getArticlesByPromotionAndCategory(promotion!, category!);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetSavedArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['savedArticles'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSavedArticles();
      } catch (error) {
        console.error('Error fetching saved articles:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReadingHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['readingHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getReadingHistory();
      } catch (error) {
        console.error('Error fetching reading history:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (article: Article) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadArticle(article);
    },
    onSuccess: async () => {
      // Invalidate all article-related queries to ensure Home and News feeds update immediately
      await queryClient.invalidateQueries({ queryKey: ['articles'] });
      await queryClient.refetchQueries({ queryKey: ['articles'] });
      toast.success('Article published and now publicly visible in Home and News feeds');
    },
    onError: (error: unknown) => {
      const errorMessage = normalizeErrorMessage(error);
      toast.error(errorMessage);
    },
  });
}

export function useSearchArticles(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles', 'search', searchText],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchText.trim()) return [];
      return actor.searchArticles(searchText);
    },
    enabled: !!actor && !isFetching && !!searchText.trim(),
  });
}
