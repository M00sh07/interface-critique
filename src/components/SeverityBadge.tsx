import { cn } from '@/lib/utils';
import { Severity } from '@/types/critique';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        'severity-badge',
        {
          'severity-critical': severity === 'critical',
          'severity-moderate': severity === 'moderate',
          'severity-minor': severity === 'minor',
        },
        className
      )}
    >
      {severity}
    </span>
  );
}
