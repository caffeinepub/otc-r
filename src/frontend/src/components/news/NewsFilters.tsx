import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface NewsFiltersProps {
  selectedPromotion: string | null;
  selectedCategory: string | null;
  onPromotionChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
}

const PROMOTIONS = ['WWE', 'All Elite Wrestling', 'New Japan Pro-Wrestling'];
const CATEGORIES = ['Injuries', 'Returns', 'Contracts', 'Title Changes', 'Backstage Updates'];

export default function NewsFilters({
  selectedPromotion,
  selectedCategory,
  onPromotionChange,
  onCategoryChange,
}: NewsFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Promotion</Label>
        <Select
          value={selectedPromotion || 'all'}
          onValueChange={(value) => onPromotionChange(value === 'all' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Promotions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Promotions</SelectItem>
            {PROMOTIONS.map((promo) => (
              <SelectItem key={promo} value={promo}>
                {promo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={selectedCategory || 'all'}
          onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
