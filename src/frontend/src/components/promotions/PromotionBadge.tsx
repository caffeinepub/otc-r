interface PromotionBadgeProps {
  promotion: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PromotionBadge({ promotion, size = 'md' }: PromotionBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const imagePath = getPromotionImage(promotion);

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <img
        src={imagePath}
        alt={`${promotion} logo`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function getPromotionImage(promotion: string): string {
  const normalized = promotion.toLowerCase();
  if (normalized.includes('wwe')) {
    return '/assets/generated/promo-wwe-badge.dim_256x256.png';
  }
  if (normalized.includes('aew') || normalized.includes('all elite')) {
    return '/assets/generated/promo-aew-badge.dim_256x256.png';
  }
  if (normalized.includes('njpw') || normalized.includes('new japan')) {
    return '/assets/generated/promo-njpw-badge.dim_256x256.png';
  }
  return '/assets/generated/promo-wwe-badge.dim_256x256.png';
}
