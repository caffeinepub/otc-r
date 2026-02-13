import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const PROMOTIONS = ['WWE', 'All Elite Wrestling', 'New Japan Pro-Wrestling'];

export default function PromotionPicker() {
  const { data: profile } = useGetCallerUserProfile();
  const { mutate: saveProfile } = useSaveCallerUserProfile();

  const favoritePromotions = profile?.favoritePromotions || [];

  const handleToggle = (promotion: string) => {
    if (!profile) return;

    const newFavorites = favoritePromotions.includes(promotion)
      ? favoritePromotions.filter((p) => p !== promotion)
      : [...favoritePromotions, promotion];

    saveProfile({
      ...profile,
      favoritePromotions: newFavorites,
    });
  };

  return (
    <div className="space-y-3">
      {PROMOTIONS.map((promotion) => (
        <div key={promotion} className="flex items-center space-x-2">
          <Checkbox
            id={promotion}
            checked={favoritePromotions.includes(promotion)}
            onCheckedChange={() => handleToggle(promotion)}
          />
          <Label htmlFor={promotion} className="cursor-pointer">
            {promotion}
          </Label>
        </div>
      ))}
    </div>
  );
}
