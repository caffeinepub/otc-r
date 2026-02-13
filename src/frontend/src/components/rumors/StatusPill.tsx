import { Badge } from '@/components/ui/badge';

interface StatusPillProps {
  status: 'confirmed' | 'likely' | 'false';
}

export default function StatusPill({ status }: StatusPillProps) {
  const variants = {
    confirmed: {
      label: 'Confirmed',
      className: 'bg-confirmed/20 text-confirmed border-confirmed',
    },
    likely: {
      label: 'Likely',
      className: 'bg-rumor/20 text-rumor border-rumor',
    },
    false: {
      label: 'False',
      className: 'bg-destructive/20 text-destructive border-destructive',
    },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={variant.className}>
      {variant.label}
    </Badge>
  );
}
