import { ChevronRight, Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CritiqueIssue, CRITIQUE_CATEGORIES } from '@/types/critique';
import { SeverityBadge } from './SeverityBadge';

interface CritiqueCardProps {
  issue: CritiqueIssue;
  isActive?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function CritiqueCard({ issue, isActive, onClick, compact }: CritiqueCardProps) {
  const category = CRITIQUE_CATEGORIES.find(c => c.id === issue.category);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left critique-card flex items-center gap-3 group",
          isActive && "border-primary/50 bg-primary/5"
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={issue.severity} />
            <span className="text-xs text-muted-foreground truncate">
              {category?.title}
            </span>
          </div>
          <p className="text-sm font-medium truncate">{issue.observation}</p>
        </div>
        <ChevronRight className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isActive && "text-primary rotate-90"
        )} />
      </button>
    );
  }

  return (
    <div className={cn(
      "critique-card",
      isActive && "border-primary/50 bg-primary/5"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={issue.severity} />
          <span className="text-xs text-muted-foreground font-medium">
            {category?.title}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Observation */}
        <div>
          <p className="text-sm font-medium text-foreground">
            {issue.observation}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Why it matters
            </p>
            <p className="text-sm text-secondary-foreground">
              {issue.whyItMatters}
            </p>
          </div>
        </div>

        {/* Suggestion */}
        <div className="flex gap-2">
          <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Suggestion
            </p>
            <p className="text-sm text-foreground">
              {issue.suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
